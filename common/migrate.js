const fs = require("fs");
const path = require("path");
var loggerTag = "Migrate";
module.exports.log = {};


function info(messsage) { module.exports.log({ level: "info", label: loggerTag, message: messsage }); }
function debug(debug) { module.exports.log({ level: "debug", label: loggerTag, message: debug }); }
function error(error) { module.exports.log({ level: "error", label: loggerTag, message: error }); }


function getType(key) {
  switch (key) {
    case "int": return "INTEGER";
    case "string": return "TEXT";
  }
}

module.exports.migrate = function migrate(db, migrationDir) {
  debug("Starting DB Migration");
  db.prepare("CREATE TABLE IF NOT EXISTS Migrations (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR (255) NOT NULL, `run_on` datetime NOT NULL)").run();
  var files = fs.readdirSync(migrationDir);
  files.forEach((file) => {
    debug("Processing Migration: " + file);
    var existingInDb = db.prepare("SELECT * FROM Migrations WHERE name=?").get(file);
    if (!existingInDb) {
      var req = require(path.join(migrationDir, file));
      var data = req.up(db);
      if (data.sql === true) {
        try {
          db.prepare(data.command).run(data.values);
        } catch (err) {
          if (err) {
            error(err);
          }
          error(data.command);
          error(data.values);
        }
      } else {
        var sql = "CREATE TABLE ";
        if (data.ifNotExists) { sql += "IF NOT EXISTS "; }
        sql += data.name + " (";

        var values = {};
        Object.keys(data.columns).forEach((key, index) => {

          sql += key;
          sql += " ";


          sql += getType(data.columns[key].type);
          if (data.columns[key].primaryKey === true) { sql += " PRIMARY KEY"; }
          if (data.columns[key].unique === true) { sql += " UNIQUE"; }
          if (data.columns[key].autoIncrement === true) { sql += " AUTOINCREMENT"; }
          var def = data.columns[key].defaultValue;
          if (data.columns[key].defaultValue !== undefined) {
            var t = typeof (data.columns[key].defaultValue);
            if (typeof (data.columns[key].defaultValue) === "string") {
              sql += " DEFAULT '" + data.columns[key].defaultValue + "'";
            } else {
              sql += " DEFAULT " + data.columns[key].defaultValue;
            }
          }
          if (index !== Object.keys(data.columns).length - 1) { sql += ", "; }


        });

        sql += ")";

        try {
          var insert = db.prepare(sql);
          insert.run();
          db.prepare("INSERT INTO Migrations (name,run_on) VALUES (?,?);").run(file, new Date().toISOString());
        } catch (err) {
          if (err) {
            error(err);
          }
          error(sql);
          error(values);
        }
      }
    }
  });

  debug("Finished DB Migration");
};

module.exports.getFileList = function getFileList(migrationDir) {
  return fs.readdirSync(migrationDir);
};

module.exports.insertTestData = function insertTestData(db, migrationDir) {
  var files = fs.readdirSync(migrationDir);
  files.forEach((file) => {
    var req = require(path.join(migrationDir, file));
    var data = req.testData(db);
    if (data && data.sql === true) {
      try {
        db.prepare(data.command).run(data.values);
      } catch (err) {
        if (err) {
          error(err);
        }
        error(data.command);
        error(data.values);
      }
    }
  });
};

module.exports.test = function test(db, migrationDir) {
  var files = fs.readdirSync(migrationDir);
  files.forEach((file) => {
    var req = require(path.join(migrationDir, file));
    var data = req.test(db);
    if (data && data.sql === true) {
      try {
        var result = db.prepare(data.command).get();
        debug(result);
      } catch (err) {
        if (err) {
          error(err);
        }
        error(data.command);
        error(data.values);
      }
    }
  });
};