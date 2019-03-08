const path = require('path');
const winston = require('winston');
var config = require('./config');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    //winston.format.colorize(),
    winston.format.printf(info => {
      if (info.label) {
        var out = `${info.timestamp} [${info.label}][${info.level}]: ${info.message}`;
        return out;
      } else {
        var out = `${info.timestamp} [${info.level}]: ${info.message}`;
        return out;
      }
    }),
  ),
  defaultMeta: { service: 'user-service' },
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
if (process.env.MODE === 'dev' || process.env.MODE === 'test') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      //winston.format.colorize(),
      winston.format.printf(info => {
        let out = `${info.timestamp} [${info.level}]: ${info.message}`;
        if (info.metadata.error) {
          out = out + ' ' + info.metadata.error;
          if (info.metadata.error.stack) {
            out = out + ' ' + info.metadata.error.stack;
          }
        }
        return out;
      }),
    )
  }));
}


//const logger = winston.createLogger({
//  level: 'info',
//  format: winston.format.json(),
//  transports: [
//    new winston.transports.File({
//      filename: path.join(process.env.LOGS_DIR, 'error.log'),
//      level: 'error'
//    }),
//    new winston.transports.File({
//      filename: path.join(process.env.LOGS_DIR, 'combined.log')
//    })
//  ]
//});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
//if (process.env.MODE === 'dev') {
//  logger.add(new winston.transports.Console({
//    format: combine(
//      label({ label: 'right meow!' }),
//      timestamp(),
//      prettyPrint()
//    ),
//   
//    level: 'silly',
//  }));
//} else {
//  logger.add(new winston.transports.Console({
//    format: winston.format.simple(),
//    level: 'info'
//  }));
//}

module.exports.log = function (method, obj) {
  if (typeof obj === 'string' || obj instanceof String)
    logger.log(method, 'from client: ' + obj);
  else {
    if (obj) {
      logger.log(obj);
    }
  }
};

module.exports.debug = function (label, message) {
  var obj = {};
  obj.level = 'debug';
  obj.label = label;
  obj.message = message;
  logger.log('debug', obj);
};

module.exports.info = function (label, message) {
  var obj = {};
  obj.level = 'info';
  obj.label = label;
  obj.message = message;
  logger.log('info', obj);
};

module.exports.error = function (label, message) {
  var obj = {};
  obj.level = 'error';
  obj.label = label;
  obj.message = message;
  logger.log('error', obj);
};