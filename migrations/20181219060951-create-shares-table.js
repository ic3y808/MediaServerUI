exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    name: "Shares",
    columns: {
      id: { type: "string", unique: true },
      url: { type: "string", defaultValue: "" },
      description: { type: "string", defaultValue: "" },
      created: { type: "string", defaultValue: "" },
      lastVisited: { type: "string", defaultValue: "" },
      expires: { type: "string", defaultValue: "" },
      visitCount: { type: "int", defaultValue: 0 },
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
