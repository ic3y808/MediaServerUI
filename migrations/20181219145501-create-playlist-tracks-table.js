exports.setup = function (options, seedLink) {
 
};

exports.up = function (db) {
  return db.createTable("PlaylistTracks", {
    columns: {
      id: { type: "int" },
      song_id: { type: "int" }
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
