const store = require('store');
const config = require('config');
const promisify = require('bluebird').promisify;
const rimraf = promisify(require('rimraf'));

const NEDB_PATH = config.NEDB_PATH;

module.exports = reset;

function reset() {
	return store.disconnect()
	.then(rimraf.bind(null, NEDB_PATH))
	.then(store.connect.bind(store));
}
