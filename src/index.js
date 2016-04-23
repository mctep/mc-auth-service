const initServer = require('lib/init-server');
const config = require('config');
const logger = require('logger');
const app = require('app');

const start = app.start;
const PORT = config.PORT;

initServer({ start, PORT, logger });
