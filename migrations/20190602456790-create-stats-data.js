exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    sql: true,
    command: "INSERT OR IGNORE INTO `Stats`(`id`,`tracks_served`,`data_sent`) VALUES (0,?,?);",
    values: [0, 0]
  };
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
