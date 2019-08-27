exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "SharesItems",
    columns: {
      id: { type: "string", unique: true },
      album_id: { type: "string", defaultValue: "" },
      artist_id: { type: "string", defaultValue: "" },
      track_id: { type: "string", defaultValue: "" },
      genre_id: { type: "string", defaultValue: "" },
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
