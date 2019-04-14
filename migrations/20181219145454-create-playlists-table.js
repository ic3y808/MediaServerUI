"use strict";

exports.setup = function (options, seedLink) {
 
};

exports.up = function (db) {
  return db.createTable("Playlists", {
    columns: {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", defaultValue: "" },
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
