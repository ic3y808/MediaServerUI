const SABnzbd = require('./plugin')
var log = require('../../logger');
var sabnzbd = {};
module.exports.socketConnect = function (socket) {
  log.debug('sabnzbd plugin socketConnect');

  socket.on('test_sabnzbd_settings', function (settings) {
    log.debug('test_sabnzbd_settings');
    if (settings.sabnzbd_host && settings.sabnzbd_apikey) {
      var test = new SABnzbd(settings.sabnzbd_host, settings.sabnzbd_api_key);



      test.status().then(function (status) {
        log.info('sabnzbd status  : ' + status);
        var status = { result: 'Success!' };
        socket.emit('test_sabnzbd_connection_result', status);
      }).catch(function (error) {
        var status = { result: 'Failed!' };
        socket.emit('test_sabnzbd_connection_result', status);
      });
    } else {
      var status = { result: 'Failed!' };
      socket.emit('test_sabnzbd_connection_result', status);
    }

  });
};


module.exports.login = function () {
  sabnzbd = new SABnzbd(settings.sabnzbd_host, settings.sabnzbd_api_key);
}

// sabnzbd = new SABnzbd(settings.sabnzbd_host, settings.sabnzbd_api_key);
// var version = sabnzbd.version();
//log.debug('version version: ' + version);

log.info('sabnzbd plugin loaded');