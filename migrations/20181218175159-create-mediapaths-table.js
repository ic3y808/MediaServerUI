exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "MediaPaths",
    columns: {
      display_name: { type: "string", primaryKey: true, unique: true },
      path: { type: "string" }
    },
    ifNotExists: true
  };
};

exports.down = function () {
  return null;
};

exports._meta = {
  "version": 1
};
