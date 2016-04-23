const userType = require('./user');
const userInput = require('./user/input');
const userOutput = require('./user/output');

module.exports = {
	types: {
		user: userType
	},

	transforms: {
		user: [
			userInput,
			userOutput
		]
	}
};
