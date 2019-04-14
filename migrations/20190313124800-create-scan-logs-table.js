exports.setup = function (options, seedLink) {
 
};

exports.up = function (db) {
  return db.createTable("ScanEvents", {
    columns: {
      event_type: { type: "string", defaultValue: "" },
      reason: { type: "string", defaultValue: "" },
      result: { type: "string", defaultValue: "" },
      time: { type: "int" },
      path: { type: "string", defaultValue: "" },
      title: { type: "string", defaultValue: "" },
      artist: { type: "string", defaultValue: "" },
      artist_id: { type: "string", defaultValue: "" },
      album: { type: "string", defaultValue: "" },
      album_id: { type: "string", defaultValue: "" },
      quality: { type: "string", defaultValue: "" },
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
