exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "Users",
    columns: {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      type: { type: "string", defaultValue: "user" },
      username: { type: "string", unique: true },
      password: { type: "string" },
      lastfm_username: { type: "string" },
      lastfm_password: { type: "string" },
      registered: { type: "string" },
      last_login: { type: "string" },
      now_playing: { type: "string" },
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
