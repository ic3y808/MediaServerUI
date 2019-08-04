exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "Stats", columns: {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      tracks_served: { type: "int", defaultValue: 0 },
      data_sent: { type: "int", defaultValue: 0 }
    },
    ifNotExists: true
  };
};

exports.down = function (db) {
  return null;
};

exports.test = function () {
  return null;
};

exports._meta = {
  "version": 1
};
