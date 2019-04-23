var log = require("../../../common/logger");
var path = require("path");
const db = require("better-sqlite3")(path.join(process.env.DATA_DIR, "database.db"));
db.pragma("journal_mode = WAL");
var dbmigrate = require("db-migrate");
var dbm = dbmigrate.getInstance(true);

process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));

module.exports.io = {};

module.exports.init = function () {
  return dbm.up();
};

module.exports.loadSettings = function (key, callback) {
  try {
    var settingsResult = db.prepare("SELECT * from Settings WHERE settings_key=?").get(key);
    if (settingsResult && settingsResult.settings_value) {
      var settings = JSON.parse(settingsResult.settings_value);
      if (settings) {
        callback({ key: key, data: settings });
      } callback(null);
    } callback(null);
  } catch (err) { callback(null); }
};

module.exports.saveSettings = function (key, value, callback) {
  try {
    const stmt = db.prepare("INSERT OR REPLACE INTO Settings (settings_key, settings_value) VALUES (?, ?) ON CONFLICT(settings_key) DO UPDATE SET settings_value=?");
    var obj = JSON.stringify(value);
    const info = stmt.run(key, obj, obj);
  } catch (error) {
    if (error) {
      log.error("alloyui", JSON.stringify(error));
    }
  }
  callback();
};

module.exports.disconnectDb = function (callback) {
  try {
    db.close();
  } catch (error) {
    if (error) {
      log.error("alloyui", JSON.stringify(error));
    }
  }
  callback();
};

module.exports.socketConnect = function (socket) {
  socket.on("load_settings", function (key) {
    log.debug("alloyui", "Load settings requested for key: " + key);
    module.exports.loadSettings(key, function (result) {
      log.debug("alloyui", "Settings Loaded");
      socket.emit("settings_loaded_event", result);
    });
  });
  socket.on("save_settings", function (settings) {
    log.debug("alloyui", "Save settings requested for key: " + settings.key);
    module.exports.saveSettings(settings.key, settings.data, function () {
      log.debug("alloyui", "Settings Saved");
      socket.emit("settings_saved_event");
    });
  });
  socket.on("disconnect_db", function () {
    log.info("alloyui", "UI requested db to disconnect: ");
    module.exports.disconnectDb(function () {
      log.info("alloyui", "shutting down.... restart server");

      process.exit(0);

    });
  });
};