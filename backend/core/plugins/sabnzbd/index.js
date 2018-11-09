const SABnzbd = require('./plugin')
var log = require('../../logger');
var db = require('../../database');
var sabnzbd = {};
var timer = {};
module.exports.io = {};
module.exports.isLoggedIn = false;

module.exports.socketConnect = function (socket) {
  log.debug('sabnzbd plugin socketConnect');
  socket.on('save_sabnzbd_settings', function (settings) {
    log.debug('Sabnzbd Settings save requested');
    db.saveSabnzbdSettings(settings, function (result) {
      module.exports.login();
      log.debug('Sabnzbd Settings saved');
    });
  });
  socket.on('load_sabnzbd_settings', function () {
    log.debug('Sabnzbd Settings loading');
    db.loadSabnzbdSettings(function (result) {
      socket.emit('sabnzbd_settings_event', result);
      log.debug('Sabnzbd Settings loaded');
    });
  });
  socket.on('test_sabnzbd_settings', function (settings) {
    log.debug('test_sabnzbd_settings');
    if (settings.sabnzbd_host && settings.sabnzbd_apikey) {
      module.exports.login();

      var test = new SABnzbd(settings.sabnzbd_host, settings.sabnzbd_api_key);

      test.status().then(function (status) {
        log.info('sabnzbd status  : ' + status);
        var status = {
          result: 'Success!'
        };
        socket.emit('test_sabnzbd_connection_result', status);
      }).catch(function (error) {
        var status = {
          result: 'Failed!'
        };
        socket.emit('test_sabnzbd_connection_result', status);
      });
    } else {
      var status = {
        result: 'Failed!'
      };
      socket.emit('test_sabnzbd_connection_result', status);
    }

  });
};

module.exports.ping = function () {
  clearInterval(timer);
  timer = setInterval(function () {
    if (sabnzbd) {
      sabnzbd.version().then(function (version) {
        module.exports.io.emit("sabnzbd_ping", JSON.stringify(version));
      }).catch(function (error) {
        log.error('sabnzbd status  : ' + error);
      });
    }
  }, 1000);
};

module.exports.login = function () {
  db.loadSabnzbdSettings(function (s) {
    if (s) {
      var settings = s[0];
      sabnzbd = {};
      if (settings.host && settings.apikey) {
        sabnzbd = new SABnzbd(settings.host, settings.apikey);
        if (sabnzbd) {
          sabnzbd.status().then(function (status) {
            log.debug('sabnzbd status  : ' + status.result);
            module.exports.isLoggedIn = true;
            module.exports.ping();
          }).catch(function (error) {
            log.error('sabnzbd status  : ' + error);
          });
        }
      }
    }
  });
};

// sabnzbd = new SABnzbd(settings.sabnzbd_host, settings.sabnzbd_api_key);
// var version = sabnzbd.version();
//log.debug('version version: ' + version);

log.info('sabnzbd plugin loaded');