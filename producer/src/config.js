var path = require('path');
var winston = require('winston');

var config = {};

config.env = {};
config.env.inProduction = process.env.ENV === 'prd';
config.env.requestDataCron = config.env.inProduction ? '0 */15 * * * *' : '*/60 * * * * *' // Run every 60s in dev.

config.base = {};
config.base.contracts = 'https://www.base.gov.pt/Base4/pt/resultados/?type=csv_contratos&tipo=1&tipocontrato=0&desdedatacontrato=%s&atedatacontrato=%s'

// Redis
config.redis = {};
config.redis.port = '6379';
config.redis.address = 'redis';
config.redis.database = config.env.inProduction ? 1 : 10;
config.redis.expireTime = 172800 //seconds - 48h

// Beanstalkd
config.beanstalkd = {};
config.beanstalkd.port = '11300';
config.beanstalkd.address = 'beanstalkd';
config.beanstalkd.tube = config.env.inProduction ? 'contracts-prod' : 'contracts-dev';

// Logging
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
