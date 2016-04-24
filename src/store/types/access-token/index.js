module.exports = {
	code: { type: String, index: true },
	user: { link: 'user', reverse: 'accessTokens' },
	expiresAt: { type: Date, expireAfterSeconds: 0 }
};
