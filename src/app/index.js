const express = require('express');
const store = require('store');
const logger = require('logger');
const fortune = require('fortune');
const BadRequestError = require('fortune/lib/common/errors').BadRequestError;
const jsonApiSerializer = require('fortune-json-api');

const app = express();

module.exports = app;
module.exports.start = start;
module.exports.stop = stop;

app.disable('x-powered-by');

const jsonApiListener = fortune.net.http(store, {
	serializers: [
		[jsonApiSerializer, { prefix: '/v1' }]
	]
});

app.use('/v1', (req, res) => {
	return jsonApiListener(req, res)
	.catch(BadRequestError, (error) => logger.info(error))
	.catch((error) => logger.error(error));
});

app.use('/', (req, res) => {
	res.send('hello');
});

function start() {
	return store.connect().then(() => app);
}

function stop() {
	return store.disconnect().then(() => app);
}
