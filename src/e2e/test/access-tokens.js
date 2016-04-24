const Promise = require('bluebird');
const request = require('supertest-as-promised');
const app = require('app');
const start = app.start;
const stop = app.stop;
const reset = require('e2e/tools/reset-store');

const headers = {
	Accept: 'application/vnd.api+json',
	'Content-Type': 'application/vnd.api+json'
};

function createUser() {
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
}

describe('access tokens api', function() {
	before(start);
	beforeEach(reset);
	after(stop);

	describe('after user create', function() {
		beforeEach(createUser);

		it('should create accessToken', function() {
			return request(app).post('/v1/accessTokens').set(headers)
			.send({
				data: {
					type: 'accessToken',
					attributes: {
						username: 'test',
						service: 'test',
						password: 'test'
					}
				}
			})
			.expect(201);
		});
	});

	describe('expiration test', function() {
		beforeEach(createUser);
		beforeEach(function() {
			const expiresAt = new Date(new Date().getTime() + 1000);

			return request(app).post('/v1/accessTokens').set(headers)
			.send({
				data: {
					type: 'accessToken',
					attributes: {
						username: 'test',
						service: 'test',
						password: 'test',
						expiresAt
					}
				}
			})
			.then((response) => {
				this.tokenId = response.body.data.id;
			});
		});

		afterEach(function() {
			delete this.tokenId;
		});

		it('should return created token before 1 second', function() {
			return request(app).get(`/v1/accessTokens/${this.tokenId}`)
			.expect(200);
		});

		it('should not find token after 1 second', function() {
			return Promise.delay(1500).then(() =>
				request(app).get(`/v1/accessTokens/${this.tokenId}`)
				.expect(404)
			);
		});
	});
});
