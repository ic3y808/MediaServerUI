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
  //CREATE TABLE IF NOT EXISTS `Genres` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT UNIQUE);
  return db.createTable('Genres', {
    columns: {
      id: { type: 'string', defaultValue: '', unique: true },
      name: { type: 'string', defaultValue: '', unique: true },
      track_count: { type: 'int', defaultValue: 0 },
      starred: { type: 'string', defaultValue: 'false' },
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
