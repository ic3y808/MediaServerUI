const path = require("path");
const winston = require("winston");
const electron = require("electron");
const log = require("electron-log");
const { ipcRenderer } = electron;
log.catchErrors();
module.exports.callback = {};

const transports = {
  err: new winston.transports.File({
    filename: path.join(process.env.LOGS_DIR, "error.log"),
    level: "error",
    json: true,
    timestamp: true
  }),
  log: new winston.transports.File({
    filename: path.join(process.env.LOGS_DIR, "combined.log"),
    json: true,
    timestamp: true,
  }),
  console: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
      //winston.format.colorize(),
      winston.format.printf((info) => {
        let out = `${info.timestamp} [${info.level}]: ${info.message}`;
        if (info.metadata.error) {
          out = out + " " + info.metadata.error;
          if (info.metadata.error.stack) {
            out = out + " " + info.metadata.error.stack;
          }
        }
        return out;
      })
    )
  })
};


const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    transports.err,
    transports.log
  ]
});

transports.err.level = "error";


if (process.env.MODE === "dev" || process.env.MODE === "test") {
  transports.log.level = "debug";
  transports.console.level = "debug";
  logger.add(transports.console);
}

module.exports.log = function (method, obj) {
  if (typeof obj === "string" || obj instanceof String) { logger.log(method, "from client: " + obj); }
  else {
    if (obj) {
      logger.log(obj);
    }
  }
  if (ipcRenderer) { ipcRenderer.send("log-update"); }
  if (typeof module.exports.callback === "function") { module.exports.callback(); }
};

module.exports.debug = function (label, message) {
  var obj = {};
  obj.level = "debug";
  obj.label = label;
  obj.message = message;
  module.exports.log("debug", obj);
};

module.exports.info = function (label, message) {
  var obj = {};
  obj.level = "info";
  obj.label = label;
  obj.message = message;
  module.exports.log("info", obj);
};

module.exports.error = function (label, message) {
  var obj = {};
  obj.level = "error";
  obj.label = label;
  obj.message = message;
  module.exports.log("error", obj);
};

module.exports.query = function (cb) {

  const options = {
    from: new Date() - (24 * 60 * 60 * 1000),
    until: new Date(),
    limit: 100,
    order: "desc",
    fields: ["message", "level", "timestamp", "label"],
    json: true
  };
  logger.query(options, function (err, results) {
    if (err) {
      cb(err);
    } else {
      cb(results.file);
    }
  });
};