/* eslint-disable no-process-env, no-magic-numbers */
const path = require('path');
const fs = require('fs');
const env = require('node-env-file');

const envfilename = path.resolve(__dirname,
	process.env.ENV_FILE || '../volumes/.env'
);

if (fs.existsSync(envfilename)) { // eslint-disable-line no-sync
	env(envfilename);
}

const NEDB_PATH_DEFAULT = path.resolve(__dirname, '..', 'volumes', 'nedb');
const NEDB_PATH_TEST = path.resolve(__dirname, '..', 'volumes', 'nedb-test');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const TESTING = NODE_ENV === 'test';
const NEDB_PATH = TESTING && NEDB_PATH_TEST || process.env.NEDB_PATH ||
	NEDB_PATH_DEFAULT;
const SECRET = process.env.SECRET || 'secret string';
const SALT_LENGTH = TESTING && 1 || process.env.SALT_LENGTH || 10;

module.exports = { NODE_ENV, PORT, TESTING, NEDB_PATH, SECRET, SALT_LENGTH };
