exports.setup = function (options, seedLink) {
 
};

exports.up = function(db) {
  return db.createTable("CoverArt", {
    columns:{
      id: { type: "string", unique: true },
      album: { type: "string", defaultValue: "" }
    },
    ifNotExists: true
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
