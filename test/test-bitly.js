var config = require('../config/config.js');
var bitlyapi = require('node-bitlyapi');

var Bitly = new bitlyapi({
  client_id: config.bitly.clientId,
  client_secret: config.bitly.clientSecret
});

Bitly.setAccessToken(config.bitly.AccessToken);

Bitly.shortenLink('http://github.com/nkirby/node-bitlyapi', function(err, results) {

  results = JSON.parse(results);

  if (results.status_code !== 200)
    console.log('Error: ' + results.status_txt);
  else
    console.log(results.data.url);

});
