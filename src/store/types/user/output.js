module.exports = userOutput;

function userOutput(context, record) {
	delete record.hash;
	return record;
}
