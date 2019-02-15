'use strict';

var dbm;
var type;
var seed;
var config = require('../common/config')
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
  return db.runSql('INSERT OR REPLACE INTO `Settings`(`settings_key`,`settings_value`) VALUES (?,?);', ['alloydb_settings', '{"alloydb_host":"localhost","alloydb_port":4000,"alloydb_apikey":"' + process.env.API_KEY + '","alloydb_include_port_in_url":true,"alloydb_lastfm_username":"","alloydb_lastfm_password":"","alloydb_scrobble":false,"alloydb_love_tracks":false}'], function (err) {
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
