const _ = require('lodash');
const ResponseErrors = require('fortune/lib/common/errors');
const UnsupportedError = ResponseErrors.UnsupportedError;
const BadRequestError = ResponseErrors.BadRequestError;
const NotFoundError = ResponseErrors.NotFoundError;
const checkPasswordHash = require('lib/password').checkPasswordHash;
const SECRET = require('config').SECRET;
const crypto = require('crypto');

const ACCSESS_TOKEN_LENGTH = 16;

module.exports = accessTokenInput;
module.exports.accessTokenCreate = accessTokenCreate;

function findUser(context, username, service) {
	return context.transaction.find('user', null, {
		match: { username, service }
	});
}

function accessTokenCreate(context, _record) {
	return Promise.resolve(_record)
	.then((record) => {
		if (record.password && record.username && record.service) {
			return record;
		}

		const error = new BadRequestError('Missing credentials');
		error.code = 'ACCESS_TOKEN_MISSING_CREDENTIALS';
		throw error;
	})
	.then((record) => {
		const username = record.username;
		const service = record.service;

		return findUser(context, username, service)
		.then(expandUser)
		.then(checkPassword)
		.then(createCode)
		.then(normalizeUser)
		.then(() => record);

		function expandUser(records) {
			if (records.count === 1) {
				record.user = records[0];
				return record;
			}

			const error = new NotFoundError('User not found');
			error.code = 'ACCESS_TOKEN_USER_NOT_FOUND';
			throw error;
		}

		function checkPassword() {
			const hash = record.user.hash;
			const password = record.password;

			return checkPasswordHash(hash, username, password, SECRET)
			.then((valid) => {
				if (valid) { return record; }

				const error = new BadRequestError('Invalid credentials');
				error.code = 'ACCESS_TOKEN_INVALID_CREDENTIALS';
				throw error;
			});
		}

		function createCode() {
			record.code = crypto.randomBytes(ACCSESS_TOKEN_LENGTH)
				.toString('base64');
		}

		function normalizeUser() {
			record.user = record.user.id;
		}
	});
}

function accessTokenInput(context, record) {
	const method = _.get(context, 'request.method');
	if (method === 'create') {
		return accessTokenCreate(context, record);
	}

	throw new UnsupportedError();
}
