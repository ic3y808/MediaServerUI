const logger = require("electron-log");
const watch = require("node-watch");
const electron = require("electron");
const { ipcRenderer } = electron;
logger.catchErrors();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(process.env.LOGS_DATABASE);
const db = low(adapter);

db.defaults({ logs: [] }).write();

module.exports.callback = {};

module.exports.log = function (obj) {
  if (process.env.MODE === "dev" || process.env.MODE === "test") {
    console.log(obj.level + ":" + obj.label + ":" + obj.message);
  }

  try {
    db.read();
    db.get("logs")
      .push({ timestamp: new Date().toISOString(), level: obj.level, label: obj.label, message: obj.message })
      .write();
  } catch (err) {
    if (err) {
      console.log(err.message);
      console.log(err.stack);
    }
    console.log(JSON.stringify(obj));
  }

  if (ipcRenderer) { ipcRenderer.send("log-update"); }
  if (typeof module.exports.callback === "function") { module.exports.callback(); }
};

module.exports.debug = function (label, message) {
  var obj = {};
  obj.level = "debug";
  obj.label = label;
  obj.message = message;
  module.exports.log(obj);
};

module.exports.info = function (label, message) {
  var obj = {};
  obj.level = "info";
  obj.label = label;
  obj.message = message;
  module.exports.log(obj);
};

module.exports.error = function (label, err) {
  if (typeof (err) === "string") {
    var obj = {};
    obj.level = "error";
    obj.label = label;
    obj.message = err;
    module.exports.log(obj);
  } else {
    var obj1 = {};
    obj1.level = "error";
    obj1.label = label;
    obj1.message = err.message;
    var obj2 = {};
    obj2.level = "error";
    obj2.label = label;
    obj2.message = err.stack;
    module.exports.log(obj1);
    module.exports.log(obj2);
  }
};

module.exports.watchLogs = function () {
  watch(process.env.LOGS_DATABASE, (evt, name) => {
    if (ipcRenderer) { ipcRenderer.send("log-update"); }
    if (typeof module.exports.callback === "function") { module.exports.callback(); }
  });
};

module.exports.query = function (totalLimit, cb) {
  var sql = "SELECT * FROM Logs ORDER BY timestamp DESC";
  try {
    db.read();
    var results = db
      .get("logs")
      .sortBy("timestamp")
      .reverse()
      .take(100)
      .value();
    cb(results);
  } catch (err) {
    if (err) {
      module.exports.error("Logger", err);
    }
    module.exports.error("Logger", sql);
    cb(null);
  }
};