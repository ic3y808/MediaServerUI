var path = require("path");
const db = require('better-sqlite3')(path.join(process.env.DATA_DIR, "database.db"));
var dbmigrate = require('db-migrate');
var dbm = dbmigrate.getInstance(true);

module.exports.init = function () {
  return dbm.up();
};

module.exports.loadSettings = function (key, callback) {
  var settingsResult = db.prepare('SELECT * from Settings WHERE settings_key=?').get(key);
  if (settingsResult && settingsResult.settings_value) {
    var settings = JSON.parse(settingsResult.settings_value);
    if (settings) {
      callback(settings);
    } else callback(null);
  } else callback(null);
};

module.exports.saveSettings = function (key,value, callback) {
  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO Settings (settings_key, settings_value) VALUES (?, ?) ON CONFLICT(settings_key) DO UPDATE SET settings_value=?');
    var obj = JSON.stringify(value);
    const info = stmt.run(key, obj, obj);
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
  callback();
};

module.exports.loadSubsonicSettings = function (callback) {
  module.exports.loadSettings('subsonic_settings', callback);
};

module.exports.saveSubsonicSettings = function (settings, callback) {
 module.exports.saveSettings('subsonic_settings', settings, callback);
};

module.exports.loadSabnzbdSettings = function (callback) {
  module.exports.loadSettings('sabnzbd_settings', callback);
};

module.exports.saveSabnzbdSettings = function (settings, callback) {
  module.exports.saveSettings('sabnzbd_settings', settings, callback);
};