/* eslint-disable no-process-env, no-magic-numbers */
const path = require('path');
const env = process.env;

const NEDB_PATH_DEFAULT = path.resolve(__dirname, '..', 'volumes', 'nedb');
const NEDB_PATH_TEST = path.resolve(__dirname, '..', 'volumes', 'nedb-test');

const NODE_ENV = env.NODE_ENV || 'development';
const PORT = env.PORT || 3000;
const TESTING = NODE_ENV === 'test';
const NEDB_PATH = TESTING && NEDB_PATH_TEST || env.NEDB_PATH ||
	NEDB_PATH_DEFAULT;
const SECRET = env.SECRET || 'secret string';
const SALT_LENGTH = TESTING && 1 || env.SALT_LENGTH || 10;

module.exports = { NODE_ENV, PORT, TESTING, NEDB_PATH, SECRET, SALT_LENGTH };
