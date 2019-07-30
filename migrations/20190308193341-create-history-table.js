exports.setup = function (options, seedLink) {
 
};

exports.up = function (db) {
  return db.createTable("History", {
    columns: {
      history_id: { type: "int", primaryKey: true, autoIncrement: true },
      id: { type: "string" },
      type: { type: "string", defaultValue: "" },
      action: { type: "string", defaultValue: "" },
      time: { type: "int" },
      title: { type: "string", defaultValue: "" },
      artist: { type: "string", defaultValue: "" },
      artist_id: { type: "string", defaultValue: "" },
      album: { type: "string", defaultValue: "" },
      album_id: { type: "string", defaultValue: "" },
      genre: { type: "string", defaultValue: "" },
      genre_id: { type: "string", defaultValue: "" }
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
