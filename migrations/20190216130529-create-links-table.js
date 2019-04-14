exports.setup = function (options, seedLink) {
 
};

exports.up = function (db) {
  return db.createTable("Links", {
    columns: {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      type: { type: "string"},
      target: { type: "string"},
      artist_id: { type: "string" },
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
