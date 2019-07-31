exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "Playlists",
    columns: {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      name: { type: "string", defaultValue: "" },
      cache: { type: "string", defaultValue: "false" },
    },
    ifNotExists: true
  };
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
