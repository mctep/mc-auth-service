const request = require('supertest-as-promised');
const app = require('app');
const start = app.start;
const stop = app.stop;
const reset = require('e2e/tools/reset-store');

const headers = {
	Accept: 'application/vnd.api+json',
	'Content-Type': 'application/vnd.api+json'
};

describe('api', function() {
	before(start);
	beforeEach(reset);
	after(stop);

	it('should return api links', function() {
		return request(app).get('/v1').set(headers)
		.expect(200, { links: {
			users: '/v1/users',
			accessTokens: '/v1/accessTokens'
		} });
	});

	it('should not create user', function() {
		return request(app).post('/v1/users').set(headers)
		.send({}).expect(400);
	});

	it('should not create user without username and service', function() {
		return request(app).post('/v1/users').set(headers)
		.send({
			data: {
				type: 'user',
				attributes: {}
			}
		}).expect(400);
	});

	it('should create user', function() {
		return request(app).post('/v1/users').set(headers)
		.send({
			data: {
				type: 'user',
				attributes: {
					username: 'test',
					service: 'test'
				}
			}
		}).expect(201);
	});

	describe('when user exists', function() {
		beforeEach(function() {
			return request(app).post('/v1/users').set(headers)
			.send({
				data: {
					type: 'user',
					attributes: {
						username: 'test',
						service: 'test',
						password: 'test'
					}
				}
			});
		});

		it('should not create user with the same name and service', function() {
			return request(app).post('/v1/users').set(headers)
			.send({
				data: {
					type: 'user',
					attributes: {
						username: 'test',
						service: 'test'
					}
				}
			}).expect(409);
		});

		it('should create user with the same name but other service',
		function() {
			return request(app).post('/v1/users').set(headers)
			.send({
				data: {
					type: 'user',
					attributes: {
						username: 'test',
						service: 'test2'
					}
				}
			}).expect(201);
		});

		it('should not have hash in output', function() {
			return request(app).get('/v1/users').set(headers)
			.then((response) => {
				const data = response.body.data;

				data.should.be.an.instanceof(Array);
				data.forEach((record) => {
					record.attributes.should.not.have.property('hash');
				});
			});
		});
	});
});
