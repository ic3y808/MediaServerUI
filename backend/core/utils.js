var log = require("../../common/logger");

module.exports.normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

module.exports.onError = function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      log.error('alloyui', "requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      log.error('alloyui', module.exports.normalizePort(process.env.PORT || "3000") + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}