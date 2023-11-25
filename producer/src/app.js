// Producer

var util = require('util');
var https = require('https');
var qs = require('querystring');
var moment = require('moment');
var redisServer = require('redis');
var fivebeans = require('fivebeans');
var winston = require('winston');
var cron = require('cron');

var config = require('./config.js');

var logger = new (winston.Logger)({
  transports: config.logging.transports
});

var redisClient;
var queueClient;

var queueUp = false;
var redisUp = false;

var jobs = {
  execute: function () {
    new cron.CronJob(config.env.requestDataCron, function () {
      govData.get();
    }, null, true, 'America/Los_Angeles');

    // 1st run, don't wait for cron
    govData.get();
  }
}


var services = {

  start: function () {
    logger.info('Starting producer, running in PRD: ' + config.env.inProduction);

    // Catches ctrl+c event
    process.on('SIGINT', function () {
      services.close();
    });

    // Catches uncaught exceptions
    process.on('uncaughtException', function (e) {
      logger.error('Uncaught Exception: ' + e.stack);
      process.exit(1);
    });

    beans.init();
    redis.init();
  },


  close: function () {
    logger.info('Closing services...');

    queueClient.quit();
    redisClient.quit();
  }
}


var govData = {

  get: function () {

    logger.info('Starting request for data...')

    const options = {
      'method': 'POST',
      'hostname': 'www.base.gov.pt',
      'path': '/Base4/pt/resultados/',
      'headers': {
        'Host': 'www.base.gov.pt',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0',
        'Accept': 'text/plain, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Length': '197',
        'Origin': 'https://www.base.gov.pt',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://www.base.gov.pt/Base4/pt/pesquisa/?type=contratos&texto=&tipo=0&tipocontrato=0&cpv=&aqinfo=&adjudicante=&adjudicataria=&sel_price=price_c1&desdeprecocontrato=&ateprecocontrato=&desdeprecoefectivo=&ateprecoefectivo=&sel_date=date_c1&desdedatacontrato=2022-07-22&atedatacontrato=2022-07-23&desdedatapublicacao=&atedatapublicacao=&desdeprazoexecucao=&ateprazoexecucao=&desdedatafecho=&atedatafecho=&pais=0&distrito=0&concelho=0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1'
      },
      'maxRedirects': 20
    };

    var req = https.request(options, function (response) {
      var chunks = [];

      response.on('data', function (chunk) {
        chunks.push(chunk);
      });

      response.on('end', function () {

        logger.info('Response code: ' + response.statusCode);
        if (response.statusCode != 200) {
          return;
        }

        logger.info('Request end. Parsing data...');
        const entries = govData.parse(JSON.parse(Buffer.concat(chunks).toString()));

        if (entries.length === 0) {
          logger.info('Parsing done. No entries found...');
        } else {
          logger.info('Parsing done. Sending data to Redis... ' + entries.length);
          redis.persist(entries);
        }

      });
    });

    const startDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');

    const postData = qs.stringify({
      'type': 'search_contratos',
      'query': util.format('tipo=1&tipocontrato=0&desdedatacontrato=%s&atedatacontrato=%s&pais=0&distrito=0&concelho=0', startDate, endDate),
      'sort': '-publicationDate',
      'page': '0',
      'size': '50'
    });

    req.write(postData);
    req.end();
  },


  parse: function (data) {
    var entries = [];

    data.items.forEach(item => {

      const entry = {
        id: item.id
      };

      entries.push(entry);
    });

    return entries;
  }
};


// REDIS

var redis = {

  init: function () {
    redisClient = redisServer.createClient(config.redis.port, config.redis.address);

    redisClient.on('error', function (err) {
      logger.error('[REDIS] Error: ' + err);
    });

    redisClient.on('end', function (err) {
      redisUp = false;
      logger.info('[REDIS] Connection closed');

      if (!queueUp && !redisUp) {
        process.exit(0);
      }
    });

    redisClient.select(config.redis.database, function () {
      logger.info('[REDIS] Connected');

      redisClient.dbsize(function (err, numKeys) {
        logger.info('[REDIS] Total keys: ' + numKeys);
      });

      redisUp = true;

      if (queueUp && redisUp) {
        jobs.execute();
      }
    });
  },


  persist: function (entries) {
    entries.forEach(entry => {
      
      // Persist by ID
      redisClient.get(entry.id, function (entry) {
        return function (err, value) {
          if (err) {
            logger.error('[REDIS] Error on get: ' + err);
            return;
          }

          if (value == null) {
            // Key not found
            
            const payload = {
              action: 'PUBLISH',
              date: new Date().toISOString(),
              id: entry.id
            }

            logger.info('[REDIS] Key not found, adding new key: ' + payload.id);

            redisClient.set(payload.id, JSON.stringify(payload));
            redisClient.expire(payload.id, config.redis.expireTime);

            beans.put(payload);
          }
        }
      }(entry));
    });
  }
}


// FIVE BEANS

var beans = {
  init: function () {

    queueClient = new fivebeans.client(config.beanstalkd.address, config.beanstalkd.port);

    queueClient.on('connect', function () {

      queueClient.use(config.beanstalkd.tube, function (err, response) {
        if (err) {
          logger.error('[BEANSTALKD] Error connecting: ' + err);
          return;
        }

        logger.info('[BEANSTALKD] Connected:' + response);

        queueUp = true;

        if (queueUp && redisUp) {
          jobs.execute();
        }
      });
    })
    .on('error', function (err) {
      logger.error('[BEANSTALKD] Error connecting: ' + err);

    })
    .on('close', function () {
      logger.info('[BEANSTALKD] Connection closed');

      queueUp = false;

      if (!queueUp && !redisUp) {
        process.exit(0);
      }
    })
    .connect();
  },


  put: function (payload) {
    queueClient.put(0, 0, 60, JSON.stringify(payload), function (err, jobid) {
      logger.info('[BEANSTALKD] Adding message to queue: ' + payload.id);

      if (err) {
        logger.error('[BEANSTALKD] Error inserting: ' + err);
      }
    });
  }
}


services.start();