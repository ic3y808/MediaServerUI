"use strict";

exports.setup = function (options, seedLink) {
 
};

exports.up = function(db) {
  return db.createTable("Settings", {
    columns:{
      settings_key: { type: "string", unique: true },
      settings_value: { type: "string" }
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
