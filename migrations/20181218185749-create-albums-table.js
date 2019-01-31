'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('Albums', {
    columns:{
      id: { type: 'string', defaultValue: '', unique: true },
      base_path: { type: 'string', defaultValue: '' },
      base_id: { type: 'string', defaultValue: '' },
      name: { type: 'string', defaultValue: '' },
      path: { type: 'string', defaultValue: '' },
      created: {type: 'string', defaultValue: ''},
      artist: { type: 'string', defaultValue: '' },
      artist_id: { type: 'string', defaultValue: '' },
      genre: { type: 'string', defaultValue: '' },
      genre_id: { type: 'string', defaultValue: '' },
      starred: { type: 'string', defaultValue: 'false' },
      track_count: { type: 'int', defaultValue: 0 },
    },
    ifNotExists: true
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
