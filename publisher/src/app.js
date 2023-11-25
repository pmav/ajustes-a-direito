// Publisher

var TwitterApi = require('twitter-api-v2').default;

var util = require('util');
var fb = require('fb');
var bitlyapi = require('node-bitlyapi');
var winston = require('winston');
var fivebeans = require('fivebeans');
var https = require('https');  
var qs = require('querystring');

var config = require('./config.js');

var logger = new(winston.Logger)({
  transports: config.logging.transports
});

/**
 * Entry point.
 */
var main = {
  init: function() {
    logger.log('info', 'Starting publisher, running in PRD: ' + config.env.inProduction);
    
    // Register signal handlers.
    process.on('SIGINT', this.signalHandler);
    process.on('SIGTERM', this.signalHandler);

    // Catches uncaught exceptions.
    process.on('uncaughtException', function(e) {
      logger.log('error', 'Uncaught Exception: ' + e.stack);

      main.finalize(function() {
        logger.log('info', 'Processed exit, code 1');
        process.exit(1);
      });
    });

    // Initialize beanstalkd listener.
    beans.init();
  },

  signalHandler: function() {
    logger.log('info', 'SIGINT received');

    main.finalize(function() {
      logger.log('info', 'Processed exit, code 0');
      process.exit(0);
    });
  },

  finalize: function(callback) {
    beans.endCallback = callback
    beans.client.end();
  }
};

/**
 * Handle beanstalkd connections.
 */
var beans = {

  client: null,

  endCallback: null,

  init: function() {
    beans.client = new fivebeans.client(config.beanstalkd.address, config.beanstalkd.port);

    beans.client.on('connect', function() {

      logger.log('info', 'Beanstalkd connected ' + config.beanstalkd.address + ' ' + config.beanstalkd.port);

      beans.client.use(config.beanstalkd.tube, function(err, response) {
        if (err) {
          logger.log('error', 'Beanstalkd use error: ' + err);
          process.exit(1);
        }

        // Connected, wait for jobs.
        beans.client.watch(config.beanstalkd.tube, function(err, numwatched) {
          if (err) {
            logger.log('error', 'Beanstalkd watch error: ' + err);
            process.exit(1);
          }

          logger.log('info', 'Beanstalkd watching ' + config.beanstalkd.tube);
          beans.reserve();
        });
      });
    });

    beans.client.on('error', function(err) {
      logger.log('error', 'Beanstalkd error: ' + err);
    });

    beans.client.on('close', function() {
      logger.log('info', 'Beanstalkd closed');
      if (beans.endCallback !== undefined) {
        beans.endCallback();
        beans.endCallback = undefined;
      }
    });

    beans.client.connect();
  },

  reserve: function() {
    beans.client.stats_tube(config.beanstalkd.tube, function(err, response) {
      if (err)
        logger.log('error', 'Beanstalkd stats error: ' + err);

      logger.log('info', 'Beanstalkd ready jobs: ' + response['current-jobs-ready']);
    });

    beans.client.reserve(function(err, jobid, payload) {
      if (err) {
        logger.log('error', 'Beanstalkd reserve error: ' + err);
        process.exit(1);
      }

      logger.log('info', 'Beanstalkd reserve: ' + jobid);
      var entry = JSON.parse(payload);

      // Add jobid to payload.
      entry.jobid = jobid;

      // Process payload.
      publish.process(entry);
    });
  },

  destroy: function(jobid) {
    beans.client.destroy(jobid, function(err) {
      logger.log('info', 'Beanstalkd destroy: ' + jobid);
      if (err)
        logger.log('error', 'Beanstalkd destroy error: ' + err);

      // Wait before next reserve.
      setTimeout(function() {
        beans.reserve(); // Reserve next message.
      }, config.env.coldDownPeriod);
    });
  }
};

/**
 * Handle publishing to 3rd party services (e.g.: Twitter, Facebook, etc.).
 */
var publish = {

  process: function(message) {

    logger.log('info', 'Processing: ' + JSON.stringify(message));

    baseAPI.getDetails(message.id, async function(entry) {
        await publish.twitter.post(entry);
        
        // Job processed, delete it.
        beans.destroy(message.jobid);
    });
  },

  facebook: {

    init: function() {
      fb.setAccessToken(config.facebook.accessToken);
    }(),

    post: function(entry, callback) {
      var post = this.createPost(entry);

      logger.log('info', 'Publishing facebook post: ' + (post.length > 40 ? post.substring(0, 40) + '..' : post).replace(/\n/g, ' '));

      if (config.env.inProduction) {
        fb.api(config.facebook.pageId + '/feed', 'post', {
          message: post
        }, function(res) {
          // Post to facebook done.
          entry.FacebookPostUrl = ''; // Default value.

          if (!res || res.error) {
            // Error posting to facebook.
            logger.log('error', 'Publishing facebook post error: ' + (!res ? 'error occurred' : res.message));
          } else {
            // Post to facebook ok.
            var tokens = res.id.split(/_/g);
            if (tokens.length === 2)
              entry.FacebookPostUrl = util.format(config.facebook.postUrl, tokens[1]);
          }

          callback(entry);
        });
      } else {
        // Dev mode.
        entry.FacebookPostUrl = util.format(config.facebook.postUrl, 'DEV-ID');
        callback(entry);
      }
    },

    createPost: function(entry) {
      var post = '\
{CONTRACT}\n\
\n\
Adjudicante: {BUYER}\n\
Fornecedor: {SELLER}\n\
Valor: {COST}\n\
\n\
{TAGS}';

      post = post.replace(/{CONTRACT}/g, utils.cleanText(entry.ContracObject));
      post = post.replace(/{BUYER}/g, utils.cleanText(entry.Buyer));
      post = post.replace(/{SELLER}/g, utils.cleanText(entry.Seller));
      post = post.replace(/{COST}/g, utils.cleanCurrency(entry.Cost));
      post = post.replace(/{TAGS}/g, utils.createCityHashtag(utils.cleanText(entry.ExecLocal), false));

      return post;
    }
  },

  bitly: {
    bitly: null,

    init: function() {
      bitly = new bitlyapi({
        client_id: config.bitly.clientId,
        client_secret: config.bitly.clientSecret
      });

      bitly.setAccessToken(config.bitly.AccessToken);
    }(),

    process: function(entry, callback) {
      logger.log('info', 'Processing bitly url: ' + entry.FacebookPostUrl);

      if (config.env.inProduction) {
        bitly.shortenLink(entry.FacebookPostUrl, function(err, results) {
          entry.ShortFacebookPostUrl = ''; // Default value.

          try {
            results = JSON.parse(results);
            if (results.status_code !== 200) {
              logger.log('error', 'Processing bitly url error: ' + results.status_txt);
            } else {
              entry.ShortFacebookPostUrl = results.data.url;
            }
          } catch (e) {
            logger.log('error', 'Uncaught Exception on bitly.process(): ' + e.stack);
          }

          callback(entry);
        });
      } else {
        // Dev mode.
        entry.ShortFacebookPostUrl = 'http://on.fb.com/XXXXXX';
        callback(entry);
      }
    }
  },

  twitter: {

    post: async function(entry) {

      // Create tweet.
      const tweet = this.createTweet(entry);

      logger.log('info', 'Publishing twitter post with ' + tweet.length + ' chars.');

      if (config.env.inProduction) {

        // Post tweet.
        try {
          const userClient = new TwitterApi({
            appKey: config.twitter.apiKey,
            appSecret: config.twitter.apiSecret,
            accessToken: config.twitter.accessToken,
            accessSecret: config.twitter.accessTokenSecret
          });
  
          const rwClient = userClient.readWrite;
          const { data: createdTweet } = await rwClient.v2.tweet(tweet);
  
          logger.log('info', 'Tweet response: ' + createdTweet.id);
        } catch (e) {
          logger.log('error', 'Uncaught exception on twitter.post(): ' + e.stack);
        }

      } else {

        // Dev mode, do not post to Twitter.
        logger.log('info', 'Tweet response: -- running in dev --');
      }
    },

    createTweet: function(entry) {
      var sep = ['\n'];

      // Clean texts.
      var cost =          '💶 ' + utils.cleanCurrency(entry.initialContractualPrice);
      var contracObject = '🤝 ' + utils.cleanText(entry.objectBriefDescription);
      var seller =        '🛠 Fornecido por: ' + utils.cleanText(entry.contracted[0].description); 
      var buyer =         '🏛️ Para: ' + utils.cleanText(entry.contracting[0].description);
      var hashtag =       '📍 ' + utils.createCityHashtag(utils.cleanText(entry.executionPlace), true);
      var link =          'ℹ️ Detalhes em https://www.base.gov.pt/Base4/pt/detalhe/?type=contratos&id=' + entry.id; //entry.ShortFacebookPostUrl;

      var currentSep, maxVariablePartSize, variablePartSize;
      for (currentSep = 0; currentSep < sep.length; currentSep++) {
        // Check if it is possible to post using the largest separetor first.
        var fixedPart = sep[currentSep] + cost + sep[currentSep] + hashtag + sep[currentSep] + link;
        maxVariablePartSize = config.twitter.maxChars - fixedPart.length;
        variablePartSize = contracObject.length + sep[currentSep].length + seller.length + buyer.length;

        if (variablePartSize <= maxVariablePartSize) {
          return cost + sep[currentSep] + contracObject + sep[currentSep] + seller + sep[currentSep] + buyer + sep[currentSep] + hashtag + sep[currentSep] + link;
        }
      }

      // Not possible to post using the largest separetor, use the smallest.
      currentSep = sep.length - 1;

      if (variablePartSize > maxVariablePartSize) {
        var overhead = variablePartSize - maxVariablePartSize; // Get size in excess.

        while (overhead > 0) {
          if (contracObject.length > buyer.length) {
            var diff = contracObject.length - buyer.length;
            var apply = Math.min(overhead, diff);
            contracObject = utils.trimToSize(contracObject, contracObject.length - apply).trim();
            overhead = overhead - apply;
          } else if (contracObject.length < buyer.length) {
            var diff = buyer.length - contracObject.length;
            var apply = Math.min(overhead, diff);
            buyer = utils.trimToSize(buyer, buyer.length - apply).trim();
            overhead = overhead - apply;
          } else {
            contracObject = utils.trimToSize(contracObject, contracObject.length - (overhead / 2)).trim();
            buyer = utils.trimToSize(buyer, buyer.length - (overhead / 2)).trim();
            overhead = 0;
          }
        }
      }

      return cost + sep[currentSep] + contracObject + sep[currentSep] + seller + sep[currentSep] + buyer + sep[currentSep] + hashtag + sep[currentSep] + link;
    },
  }
};

var baseAPI = {

  getDetails: function (id, callback) {
    var options = {
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
        'Content-Length': '32',
        'Origin': 'https://www.base.gov.pt',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://www.base.gov.pt/Base4/pt/detalhe/?type=contratos&id=' + id,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1'
      },
      'maxRedirects': 20
    };
    
    var req = https.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        callback(JSON.parse(Buffer.concat(chunks)));
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    var postData = qs.stringify({
      'type': 'detail_contratos',
      'id': id
    });
    
    req.write(postData);
    
    req.end();
  }
};

/**
 * Generic stuff.
 */
var utils = {

  trimToSize: function(str, maxLength) {
    if (str.length > maxLength)
      return str.substring(0, maxLength - 2) + '..';

    return str;
  },

  // Remove ", (9999) and multiple spaces.
  cleanText: function(text) {
    text = text.replace(/"/g, '');
    text = text.replace(/\(\d+\)/g, '');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  },

  // Clean currency entries by removing decimals, separators and multiple spaces.
  cleanCurrency: function(currency) {
    currency = currency.replace(/"/g, '');
    currency = currency.replace(/\'|\s/g, '');
    currency = currency.replace(/,\d\d/g, '');
    currency = currency.replace(/\s+/g, ' ');
    currency = currency.replace(/\./g, '');
    return currency.trim();
  },

  createCityHashtag: function(location, isTweet) {
    try {
      // Ignore empty locations.
      if (location === undefined || location === '')
        return '';

      //array to save cities without duplicates
      var cities = [];

      // Handle multiple locations, only use the first one.
      var locations = location.split(/\n/);
      if (locations.length === 0)
        return '';


      for (var i in locations) {
        location = locations[i];

        // Split location by 'País', 'Distrito', 'Concelho'.
        var tokens = location.split(/,/);
        if (tokens.length !== 3)
          return ''

        for (var j = 1; j < tokens.length; j++) {

          // Convert city to 'CamelCase' and remove spaces.
          var city = tokens[j];
          city = city.replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
          });
          city = city.replace(/\s/g, '');

          //returns only one location for twitter - the first location
          if (isTweet)
            return '#' + city;

          if (cities[city] === undefined) {
            cities[city] = '#' + city
          }
        }
      }

      var returnCities = '';
      for (var key in cities)
        returnCities += cities[key] + ' ';

      return returnCities.trim();

    } catch (e) {
      logger.log('error', 'Uncaught Exception on utils.createCityHashtag(): ' + e.stack);
      return '';
    }
  }
};


main.init();
