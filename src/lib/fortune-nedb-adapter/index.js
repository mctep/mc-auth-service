'use strict';
const uuid = require('node-uuid');
const _ = require('lodash');
const nedbAdapter = require('fortune-nedb');

const INDEX_KEYS = ['unique', 'sparse', 'expireAfterSeconds', 'index'];

module.exports = neDBAdapterFactory;

function ensureIndex(Promise, db, options) {
	return new Promise((resolve, reject) => {
		db.ensureIndex(options, (error) => {
			if (error) { return reject(error); }
			return resolve();
		});
	});
}

function buildIndexes(type) {
	return _.compact(_.map(type, (field, name) => {
		const index = _.pick(field, INDEX_KEYS);
		if (_.isEmpty(index)) { return null; }

		index.fieldName = name;
		delete index.index;
		return index;
	}));
}

function createIndexes(Promise, db, type) {
	const indexes = buildIndexes(type);
	if (_.isEmpty(indexes)) { return null; }

	return Promise.all(
		indexes.map(
			ensureIndex.bind(null, Promise, db)
		)
	);
}

function neDBAdapterFactory(Adapter) {
	const NeDBAdapter = nedbAdapter(Adapter);

	class ExtendedNeDBAdapter extends NeDBAdapter {
		connect() {
			const args = _.toArray(arguments);
			return NeDBAdapter.prototype.connect.apply(this, args)
			.then(() => {
				const recordTypes = this.recordTypes;
				const db = this.db;

				const promises = _.compact(_.map(db, (dbType, name) => {
					return createIndexes(
						this.Promise,
						dbType,
						recordTypes[name]
					);
				}));

				return this.Promise.all(promises);
			});
		}

		create(type, records) {
			records.forEach((record) => {
				record.id = record.id || uuid.v4();
			});

			return NeDBAdapter.prototype.create.call(this, type, records);
		}
	}

	return ExtendedNeDBAdapter;
}
