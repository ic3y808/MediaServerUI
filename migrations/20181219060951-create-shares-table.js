"use strict";

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
  return db.createTable("Shares", {
    columns:{
      id: { type: "string", unique: true },
      url: { type: "string", defaultValue: "" },
      description: { type: "string", defaultValue: "" },
      created: { type: "string", defaultValue: "" },
      lastVisited: { type: "string", defaultValue: "" },
      expires: { type: "string", defaultValue: "" },
      visitCount: { type: "int", defaultValue: 0 },
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
