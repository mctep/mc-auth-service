/* eslint-env mocha */
/* eslint max-nested-callbacks: "off" */
const userCreate = require('../input').userCreate;
const ResponseErrors = require('fortune/lib/common/errors');
const BadRequestError = ResponseErrors.BadRequestError;
const ConflictError = ResponseErrors.ConflictError;

const emptyUsersTransaction = {
	find: () => Promise.resolve({ count: 0 })
};

const existsUserTransaction = {
	find: () => Promise.resolve({ count: 1 })
};

describe('userCreate', function() {
	describe('should throw BadRequestError', function() {
		it('without username and service', function() {
			return userCreate({}, {})
			.should.eventually.rejectedWith(BadRequestError);
		});

		it('without username', function() {
			return userCreate({}, { service: 'asd' })
			.should.eventually.rejectedWith(BadRequestError);
		});

		it('without service', function() {
			return userCreate({}, { username: 'asd' })
			.should.eventually.rejectedWith(BadRequestError);
		});
	});

	it('should return record', function() {
		const record = { username: 'test', service: 'test' };
		return userCreate({ transaction: emptyUsersTransaction }, record)
		.then((result) => {
			result.should.be.deep.equal(record);
			result.should.not.have.property('hash');
		});
	});

	it('should create password hash', function() {
		const record = { username: 'test', service: 'test', password: 'abc' };
		return userCreate({ transaction: emptyUsersTransaction }, record)
		.then((result) => {
			result.should.be.deep.equal(record);
			result.should.not.have.property('password');
			result.should.have.property('hash');
		});
	});

	it('should not create if the same user exists', function() {
		const record = { username: 'test', service: 'test', password: 'abc' };
		return userCreate({ transaction: existsUserTransaction }, record)
		.should.eventually.rejectedWith(ConflictError);
	});
});
