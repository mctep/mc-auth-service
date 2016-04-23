const http = require('http');
const Promise = require('bluebird');
const promisify = Promise.promisify;

const ERROR_EXIT_CODE = 1;
const SUCCESS_EXIT_CODE = 0;

module.exports = initServer;

function initServer(options) {
	const start = options.start;
	const stop = options.stop;
	const PORT = options.PORT;
	const logger = options.logger;

	return Promise.resolve(start()).then((app) => {
		const server = http.createServer(app);
		return promisify(server.listen.bind(server))(PORT)
		.then(() => server);
	})
	.then((server) => {
		logger.info(`Server started at ${PORT} port`);
		bindProcessExit(server);
	})
	.catch((error) => {
		logger.error('Fatal error. Server cannot start', error);
		throw error;
	});

	function handleSignal(name, server) {
		process.on(name, function handle() {
			logger.info(`Signal "${name}" received`);

			promisify(server.close.bind(server))()
			.then(() => {
				logger.info('Server stopped success');
				if (stop) { return stop(); }
				return null;
			})
			.then(() => {
				logger.info('Service stopped success');
				exit(ERROR_EXIT_CODE);
				return null;
			})
			.catch((error) => {
				logger.error('Fatal error when stopping', error);
				exit(SUCCESS_EXIT_CODE);
			});
		});
	}

	function bindProcessExit(server) {
		handleSignal('SIGTERM', server);
		handleSignal('SIGINT', server);
	}
}

function exit(code) {
	process.exit(code); // eslint-disable-line no-process-exit
}
