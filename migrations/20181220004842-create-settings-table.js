exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "Settings",
    columns: {
      settings_key: { type: "string", unique: true },
      settings_value: { type: "string" }
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
