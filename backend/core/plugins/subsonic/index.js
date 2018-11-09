var log = require('../../logger');
var db = require('../../database');

module.exports.io = {};
module.exports.socketConnect = function (socket) {
  socket.on('save_subsonic_settings', function (settings) {
    log.debug('Subsonic Settings save requested');
    db.saveSubsonicSettings(settings, function (result) {
      log.debug('Subsonic Settings saved');
    });
  });
  socket.on('load_subsonic_settings', function () {
    log.debug('Subsonic Settings loading');
    db.loadSubsonicSettings(function (result) {
      socket.emit('subsonic_settings_event', result);
      log.debug('Subsonic Settings loaded');
    });
  });
};
log.info('subsonic plugin loaded');