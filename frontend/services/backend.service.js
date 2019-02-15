import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

export default class Backend {
  constructor($rootScope, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    $rootScope.socket = io('//' + document.location.hostname + ':' + document.location.port);
    var that = this;
    $rootScope.socket.on('ping', function (data) {
      if (data)
        $rootScope.backend_ping = data;
    });
    $rootScope.socket.on('sabnzbd_ping', function (data) {
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
      that.$rootScope.socket.emit('save_settings', { key: 'alloydb_settings', data: $rootScope.settings.alloydb });

      if ($rootScope.settings.alloydb.alloydb_lastfm_password) {
        $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);
      }


      that.$rootScope.socket.emit('save_settings', { key: 'sabnzbd_settings', data: $rootScope.settings.sabnzbd });
      $rootScope.triggerConfigAlert("Saved!", 'success');
    }

    $rootScope.loadSettings = function () {

    }

    var setup = function () {

      if (that.$rootScope.settings.alloydb.alloydb_host && that.$rootScope.settings.alloydb.alloydb_apikey) {
        AlloyDbService.login();
      }
    }

    $rootScope.socket.on('settings_saved_event', function (settings) {
      setup();
    });

    $rootScope.socket.on('settings_loaded_event', function (settings) {
      if (settings) {
        if (settings.key === 'sabnzbd_settings') {
          $rootScope.settings.sabnzbd = settings.data;
        }


        if (settings.key === 'alloydb_settings') {
          $rootScope.settings.alloydb = settings.data;
          if(settings.data.alloydb_lastfm_password){
            $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword(settings.data.alloydb_lastfm_password);
          }

          setup();
        }
        that.AppUtilities.apply();
      }
    });




    $rootScope.socket.on('sabnzbd_history_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdHistoryResult', data);
      }
    });

    $rootScope.socket.on('sabnzbd_queue_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdQueueResult', data);
      }
    });

  }
}