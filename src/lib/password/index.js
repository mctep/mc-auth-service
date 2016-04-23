const promisify = require('bluebird').promisify;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const generateHash = promisify(bcrypt.hash);
const compareHash = promisify(bcrypt.compare);

module.exports = { makeBacon, createPasswordHash, checkPasswordHash };

function makeBacon(username, password, SECRET) {
	return crypto.createHmac('sha256', SECRET)
	.update(username).update(password)
	.digest('hex');
}

function createPasswordHash(username, password, SECRET, SALT_LENGTH) {
	return generateHash(makeBacon(username, password, SECRET), SALT_LENGTH);
}

function checkPasswordHash(hash, username, password, SECRET) {
	return compareHash(makeBacon(username, password, SECRET), hash);
}
