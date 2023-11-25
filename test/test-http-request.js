var config = require('../config/config.js');

var moment = require('moment');
var url = require('url');
var http = require('http');
var util = require('util');
var fs = require('fs');

var requestURL = config.base.contracts;
var startDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
var endDate = moment().format('YYYY-MM-DD');
var urlRequest = url.parse(util.format(requestURL, startDate, endDate));

var options = {
  host: urlRequest.hostname,
  path: urlRequest.path
};

http.request(options, function(response) {
  var data = new Buffer(0);

  response.on('data', function(chunk) {
    data = Buffer.concat([data, chunk]);
  });

  response.on('end', function() {
    console.log(response.statusCode);

    if (response.statusCode != 200) {
      return;
    }

    //console.log(data);

    data = data.toString('utf8');
    console.log(data);

    fs.writeFile('output1.log', data, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('Done');
    });

  });
}).end();
