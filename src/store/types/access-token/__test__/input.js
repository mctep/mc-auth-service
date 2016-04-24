/* eslint-env mocha */
/* eslint max-nested-callbacks: "off" */
const accessTokenCreate = require('../input').accessTokenCreate;
const ResponseErrors = require('fortune/lib/common/errors');
const BadRequestError = ResponseErrors.BadRequestError;
const NotFoundError = ResponseErrors.NotFoundError;

describe('accessTokenCreate', function() {
	const validRecord = {
		username: 'test',
		service: 'test',
		password: 'test'
	};

	const validUserRecords = {
		0: { username: 'test', hash:
			'$2a$04$W.b/3sQDOK5rSMbK1SLEbeC9GRNzR/ki0iwXOFSGBMxYzHDR8ECBO'
		}, count: 1
	};

	describe('create valid access token', function() {
		beforeEach(function() {
			const context = {
				transaction: { find: () => Promise.resolve(validUserRecords) }
			};

			const record = Object.assign({}, validRecord);

			return accessTokenCreate(context, record)
			.should.eventually.to.be.equal(record).then(() => {
				this.token = record;
			});
		});

		afterEach(function() { delete this.token; });

		it('should have code property', function() {
			this.token.should.have.property('code');
		});
	});

	describe('ACCESS_TOKEN_MISSING_CREDENTIALS', function() {
		it('should throw error', function() {
			return accessTokenCreate({}, {})
			.should.eventually.rejectedWith(BadRequestError);
		});

		it('should throw error', function() {
			return accessTokenCreate({}, { password: 'test' })
			.should.eventually.rejectedWith(BadRequestError);
		});

		it('should throw error', function() {
			return accessTokenCreate({}, { password: 'test', username: 'test' })
			.should.eventually.rejectedWith(BadRequestError);
		});
	});

	describe('ACCESS_TOKEN_USER_NOT_FOUND', function() {
		it('should throw error', function() {
			const context = {
				transaction: {
					find: () => Promise.resolve({ count: 0 })
				}
			};

			return accessTokenCreate(context, Object.assign({}, validRecord))
			.should.eventually.rejectedWith(NotFoundError);
		});
	});

	describe('ACCESS_TOKEN_INVALID_CREDENTIALS', function() {
		it('should throw error', function() {
			const context = {
				transaction: { find: () => Promise.resolve(validUserRecords) }
			};

			const record = Object.assign({}, validRecord);
			record.password = 'wrong';

			return accessTokenCreate(context, record)
			.should.eventually.rejectedWith(BadRequestError);
		});
	});
});
