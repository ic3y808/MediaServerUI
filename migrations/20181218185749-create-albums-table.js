exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "Albums",
    columns: {
      id: { type: "string", defaultValue: "", unique: true },
      name: { type: "string", defaultValue: "" },
      path: { type: "string", defaultValue: "" },
      created: { type: "string", defaultValue: "" },
      artist: { type: "string", defaultValue: "" },
      artist_id: { type: "string", defaultValue: "" },
      genre: { type: "string", defaultValue: "" },
      genre_id: { type: "string", defaultValue: "" },
      starred: { type: "string", defaultValue: "false" },
      starred_date: { type: "string", defaultValue: "" },
      rating: { type: "int", defaultValue: 0 },
      type: { type: "string", defaultValue: "" },
      play_count: { type: "int", defaultValue: 0 },
      track_count: { type: "int", defaultValue: 0 },
    },
    ifNotExists: true
  };
};

exports.down = function (db) {
  return null;
};

exports.testData = function () {
  return null;
};

exports.test = function () {
  return null;
};

exports._meta = {
  "version": 1
};
