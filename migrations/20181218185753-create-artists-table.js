'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('Artists', {
    columns: {
      id: { type: 'string', defaultValue: '', unique: true },
      name: { type: 'string', defaultValue: '' },
      sort_name: { type: 'string', defaultValue: '' },
      sort_order: { type: 'int', defaultValue: 99999999 },
      disambiguation: { type: 'string', defaultValue: '' },
      overview: { type: 'string', defaultValue: '' },
      biography: { type: 'string', defaultValue: '' },
      starred: { type: 'string', defaultValue: 'false' },
      status: { type: 'string', defaultValue: '' },
      rating: { type: 'int', defaultValue: 0 },
      type: { type: 'string', defaultValue: '' },
      path: { type: 'string', defaultValue: '' },
      track_count: { type: 'int', defaultValue: 0 },
    },
    ifNotExists: true
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
