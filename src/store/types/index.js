const userType = require('./user');
const userInput = require('./user/input');
const userOutput = require('./user/output');

const accessTokenType = require('./access-token');
const accessTokenInput = require('./access-token/input');

module.exports = {
	types: {
		user: userType,
		accessToken: accessTokenType
	},

	transforms: {
		user: [userInput, userOutput],
		accessToken: [accessTokenInput]
	}
};
