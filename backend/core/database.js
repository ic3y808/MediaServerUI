var path = require("path");
var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(path.join(process.env.DATA_DIR, "database.db"));

db.serialize(function () {
  var subsonicSettings = "CREATE TABLE IF NOT EXISTS `subsonic_settings` (" +
    "`name` TEXT UNIQUE," +
    "`host` TEXT," +
    "`port` INTEGER," +
    "`use_ssl` TEXT," +
    "`include_port_in_url` TEXT," +
    "`username` TEXT," +
    "`password` TEXT" +
    ");";
  db.run(subsonicSettings);
  var sabnzbdSettings = "CREATE TABLE IF NOT EXISTS `sabnzbd_settings` (" +
    "`name` TEXT UNIQUE," +
    "`host` TEXT," +
    "`port` INTEGER," +
    "`url_base` TEXT," +
    "`apikey` TEXT," +
    "`use_ssl` TEXT," +
    "`include_port_in_url` TEXT," +
    "`username` TEXT," +
    "`password` TEXT" +
    ");";
  db.run(sabnzbdSettings);
});

module.exports.loadSubsonicSettings = function (callback) {
  db.all("SELECT * FROM subsonic_settings", function (err, row) {
    if (err) console.log(err);
    callback(row);
  });
};

module.exports.saveSubsonicSettings = function (settings, callback) {
  try {
    var stmt = db.prepare("INSERT OR REPLACE INTO subsonic_settings VALUES (?,?,?,?,?,?,?)");
    stmt.run("general", settings.host, settings.port, settings.use_ssl, settings.include_port_in_url, settings.username, settings.password);
    stmt.finalize();
  } catch (error) {
    if (error) {
      console.log(error);
      console.log(sql);
    }
  }
  callback();
};

module.exports.loadSabnzbdSettings = function (callback) {
  db.all("SELECT * FROM sabnzbd_settings", function (err, row) {
    if (err) console.log(err);
    callback(row);
  });
};

module.exports.saveSabnzbdSettings = function (settings, callback) {
  try {
    var stmt = db.prepare("INSERT OR REPLACE INTO sabnzbd_settings VALUES (?,?,?,?,?,?,?,?,?)");
    stmt.run("general", settings.host, settings.port, settings.url_base, settings.apikey, settings.use_ssl, settings.include_port_in_url, settings.username, settings.password);
    stmt.finalize();
  } catch (error) {
    if (error) {
      console.log(error);
      console.log(sql);
    }
  }
  callback();
};