const winston = require('winston');
const config = require('config');

const Logger = winston.Logger;
const Console = winston.transports.Console;
const TESTING = config.TESTING;

const logger = new Logger({
	level: 'info',
	transports: !TESTING && [new Console()]
});

module.exports = logger;
