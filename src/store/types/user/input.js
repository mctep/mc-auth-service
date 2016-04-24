const config = require('config');
const createPasswordHash = require('lib/password').createPasswordHash;
const ResponseErrors = require('fortune/lib/common/errors');
const BadRequestError = ResponseErrors.BadRequestError;
const ConflictError = ResponseErrors.ConflictError;
const UnsupportedError = ResponseErrors.UnsupportedError;

const SECRET = config.SECRET;
const SALT_LENGTH = config.SALT_LENGTH;

module.exports = userInput;
module.exports.userCreate = userCreate;

function findUser(context, username, service) {
	return context.transaction.find('user', null, {
		match: { username, service }
	});
}

function userCreate(context, _record) {
	const username = _record.username;
	const service = _record.service;
	const password = _record.password;

	return Promise.resolve(_record)
	.then(validateCredentials)
	.then(checkExists)
	.then(handlePassword)
	.then(setHasPassword);

	function validateCredentials(record) {
		if (username && service) { return record; }

		const error = new BadRequestError(
			'username and service fields is required'
		);
		error.code = 'USER_CREDENTIALS_MISSING';
		throw error;
	}

	function checkExists(record) {
		return findUser(context, username, service)
		.then((records) => {
			if (records.count === 0) { return record; }

			const error = new ConflictError('The same user exists');
			error.code = 'USER_CREDENTIALS_ALREADY_EXISTS';
			throw error;
		});
	}

	function handlePassword(record) {
		if (!password) { return record; }
		delete record.password;

		return createPasswordHash(
			username, password,
			SECRET, SALT_LENGTH
		).then((hash) => {
			record.hash = hash;
			return record;
		});
	}

	function setHasPassword(record) {
		record.hasPassword = !!record.hash;
		return record;
	}
}

function userInput(context, record) {
	if (context.request.method === 'create') {
		return userCreate(context, record);
	}

	throw new UnsupportedError();
}
