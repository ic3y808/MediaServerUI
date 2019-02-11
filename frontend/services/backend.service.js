import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

export default class Backend {
  constructor($rootScope, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    this.socket = io('//' + document.location.hostname + ':' + document.location.port);
    var that = this;
    this.socket.on('ping', function (data) {
      if (data)
        $rootScope.backend_ping = data;
    });
    this.socket.on('sabnzbd_ping', function (data) {
      if (data)
        $rootScope.sabnzbd_ping = data;
    });
    $rootScope.settings = { advanced_mode: false };
    $rootScope.settings.alloydb = {};
    $rootScope.settings.sabnzbd = {};

    $rootScope.saveSettings = function () {

      if ($rootScope.settings.alloydb.alloydb_lastfm_password) {
        $rootScope.settings.alloydb.alloydb_lastfm_password = AppUtilities.encryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);
      }
      that.emit('save_settings', { key: 'alloydb_settings', data: $rootScope.settings.alloydb });

      if ($rootScope.settings.alloydb.alloydb_lastfm_password) {
        $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);
      }


      that.emit('save_settings', { key: 'sabnzbd_settings', data: $rootScope.settings.sabnzbd });
      $rootScope.triggerConfigAlert("Saved!", 'success');
    }

    $rootScope.loadSettings = function () {

    }

    var setup = function () {

      if (that.$rootScope.settings.alloydb.alloydb_host && that.$rootScope.settings.alloydb.alloydb_apikey) {
        AlloyDbService.login();
      }
    }

    this.socket.on('settings_saved_event', function (settings) {
      setup();
    });

    this.socket.on('settings_loaded_event', function (settings) {
      if (settings) {
        if (settings.key === 'sabnzbd_settings') {
          $rootScope.settings.sabnzbd = settings.data;
        }


        if (settings.key === 'alloydb_settings') {
          $rootScope.settings.alloydb = settings.data;
          if(settings.data.password){
            $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword(settings.data.password);
          }

          setup();
        }
        that.AppUtilities.apply();
      }
    });




    this.socket.on('sabnzbd_history_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdHistoryResult', data);
      }
    });

    this.socket.on('sabnzbd_queue_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdQueueResult', data);
      }
    });

  }

  emit(message, data) {
    this.socket.emit(message, data);
  }

  formMessage(type, data) {

    var message = {
      message: data,
      method: type
    };
    console.log(data);
    this.emit('log', message);
  }

  info(data) {
    this.formMessage('info', data);
  }

  debug(data) {
    this.formMessage('debug', data);
  }

  error(data) {
    this.formMessage('error', data);
  }
}