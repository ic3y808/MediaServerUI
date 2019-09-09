exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "LastFM",
    columns: {
      id: { type: "string", defaultValue: "", unique: true },
      type: { type: "string", defaultValue: "" },
      data: { type: "string", defaultValue: "false" },
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
