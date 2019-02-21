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
  return db.runSql('INSERT OR REPLACE INTO `MediaPaths`(`display_name`,`path`) VALUES (?,?);', ['TestMedia', 'D:\\Users\\ic3y8\\Desktop\\TestMedia'], function (err) {
  });
  
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
