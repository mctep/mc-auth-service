const config = require('config');
const createPasswordHash = require('lib/password').createPasswordHash;
const ResponseErrors = require('fortune/lib/common/errors');
const BadRequestError = ResponseErrors.BadRequestError;
const ConflictError = ResponseErrors.ConflictError;

const SECRET = config.SECRET;
const SALT_LENGTH = config.SALT_LENGTH;

module.exports = userInput;
module.exports.userCreate = userCreate;

function userCreate(context, record) {
	const username = record.username;
	const service = record.service;
	const password = record.password;

	if (!username || !service) {
		throw new BadRequestError();
	}

	return context.transaction.find('user', null, {
		match: { username, service }
	})
	.then((records) => {
		if (records.count) {
			throw new ConflictError('The same user exists');
		}
	})
	.then(() => {
		if (!password) { return record; }

		delete record.password;

		return createPasswordHash(
			username, password,
			SECRET, SALT_LENGTH
		)
		.then((hash) => {
			record.hash = hash;
			return record;
		});
	});
}

function userInput(context, record, updates) {
	if (context.request.method === 'create') {
		return userCreate(context, record);
	}

	return updates || record;
}
