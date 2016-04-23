const config = require('config');
const fortune = require('fortune');
const mkdirp = require('mkdirp');

const nedbAdapter = require('lib/fortune-nedb-adapter');

const storeOptions = require('./types');

const NEDB_PATH = config.NEDB_PATH;

mkdirp.sync(NEDB_PATH);

const adapter = [nedbAdapter, {
	dbPath: NEDB_PATH,
	autload: true,
	timestampData: true
}];

const types = storeOptions.types;
const transforms = storeOptions.transforms;

const store = fortune(types, { transforms, adapter });

module.exports = store;
