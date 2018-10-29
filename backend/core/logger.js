const fs = require("fs");
const path = require('path');
const winston = require('winston');

process.env.LOGS_DIR = path.join(process.env.DATA_DIR, "logs");
if (!fs.existsSync(process.env.LOGS_DIR)) fs.mkdirSync(process.env.LOGS_DIR);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(process.env.LOGS_DIR, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(process.env.LOGS_DIR, 'combined.log')
    })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.DEV === 'true') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info'
  }));
}

module.exports.log = function (method, obj) {
  if (typeof obj === 'string' || obj instanceof String)
    logger.log(method, 'from client: ' + obj);
  else {
    logger.log(method, 'from client:');
    logger.log(method, obj);
  }
};

module.exports.debug = function (obj) {
  logger.log('debug', obj);
};

module.exports.info = function (obj) {
  logger.log('info', obj);
};

module.exports.error = function (obj) {
  logger.log('error', obj);
};