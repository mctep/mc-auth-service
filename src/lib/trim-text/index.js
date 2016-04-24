module.exports = trimText;

function trimText(text) {
	return text.replace(/(\t|\n|\s)+/g, ' ').trim();
}
