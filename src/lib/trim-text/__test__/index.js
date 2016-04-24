/* global describe, it */
const trim = require('..');

describe('trim text function', function() {
	it('should remove tabs and line breaks', function() {
		trim(`
			hello

			world
		`).should.equal('hello world');
	});
});
