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
      name: { type: 'string', defaultValue: '' },
      path: { type: 'string', defaultValue: '' },
      created: {type: 'string', defaultValue: ''},
      artist: { type: 'string', defaultValue: '' },
      artist_id: { type: 'string', defaultValue: '' },
      genre: { type: 'string', defaultValue: '' },
      starred: { type: 'string', defaultValue: 'false' },
      rating: { type: 'int', defaultValue: 0 },
      type: { type: 'string', defaultValue: '' },
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
