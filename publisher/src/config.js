var path = require('path');
var winston = require('winston');

var config = {};

config.env = {};
config.env.inProduction = process.env.ENV === 'prd';
config.env.coldDownPeriod = config.env.inProduction // Time in ms to wait between each reserve.
	? 60 * 1000  // Wait 60s in prd.
	: 60 * 1000; // Wait 60s in dev.

config.beanstalkd = {};
config.beanstalkd.port = '11300';
config.beanstalkd.address = 'beanstalkd';
config.beanstalkd.tube = config.env.inProduction ? 'contracts-prod' : 'contracts-dev';

config.twitter = {};
config.twitter.maxChars = 280;
config.twitter.apiKey = '';
config.twitter.apiSecret = '';
config.twitter.bearerToken = '';
config.twitter.accessToken = '';
config.twitter.accessTokenSecret = ''; 
config.twitter.clientId = '';
config.twitter.clientSecret = '';

config.bitly = {};
config.bitly.clientId = '';
config.bitly.clientSecret = '';
config.bitly.AccessToken = '';

config.facebook = {}
config.facebook.pageId = '';
config.facebook.appId = '';
config.facebook.appSecret = '';
config.facebook.accessToken = '';
config.facebook.postUrl = '';

config.logging = {};
config.logging.transports = [];

config.logging.transports.push(
	new (winston.transports.File)({
		level: config.env.inProduction ? 'info' : 'debug',
		filename: 'main-' + path.basename(process.mainModule.filename, path.extname(process.mainModule.filename)) + '.log',
		maxsize: 1048576, // 1 MB
		maxFiles: 10,
		json: false,
		formatter: function(options) {
			return (new Date()).toString() +' ['+ options.level.toUpperCase() +'] '+ (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
		}
	}));

if (!config.env.inProduction) {
	config.logging.transports.push(
		new (winston.transports.Console)({
			level: 'debug',
			formatter: function(options) {
				return (new Date()).toString() +' ['+ options.level.toUpperCase() +'] '+ (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
			}
		}));
}

module.exports = config;
