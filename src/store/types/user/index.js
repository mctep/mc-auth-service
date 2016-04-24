module.exports = {
	username: { type: String, index: true },
	service: { type: String, index: true },
	hasPassword: { type: Boolean },
	hash: { type: String },
	info: { type: Object },
	accessTokens: { link: 'accessToken', isArray: true }
};
