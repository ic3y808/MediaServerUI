import io from 'socket.io-client';

export default class Backend {
  constructor($rootScope, AppUtilities, AlloyDbService, SubsonicService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    this.SubsonicService = SubsonicService;
    this.socket = io('//' + document.location.hostname + ':' + document.location.port);
    var that = this;
    this.socket.on('ping', function (data) {
      if (data)
        $rootScope.backend_ping = JSON.parse(data).date;
    });
    this.socket.on('sabnzbd_ping', function (data) {
      if (data)
        $rootScope.sabnzbd_ping = data;
    });
    $rootScope.settings = {
      alloydb: {},
      subsonic: {},
      sabnzbd: {}
    };


    this.socket.on('subsonic_settings_event', function (d) {

      if (d) {
        that.$rootScope.settings.subsonic = {};
        that.$rootScope.settings.subsonic.username = d.username;
        that.$rootScope.settings.subsonic.password = d.password;
        that.$rootScope.settings.subsonic.host = d.host;
        that.$rootScope.settings.subsonic.port = d.port;
        that.$rootScope.settings.subsonic.use_ssl = d.use_ssl;
        that.$rootScope.settings.subsonic.include_port_in_url = d.include_port_in_url;
        that.AppUtilities.broadcast('subsonicSettingsReloadedEvent');
        that.AppUtilities.apply();
        that.SubsonicService.login();
      }

    });

    this.socket.on('settings_loaded_event', function (settings) {

      //if (d) {
      //  that.$rootScope.settings.subsonic = {};
      //  that.$rootScope.settings.subsonic.username = d.username;
      //  that.$rootScope.settings.subsonic.password = d.password;
      //  that.$rootScope.settings.subsonic.host = d.host;
      //  that.$rootScope.settings.subsonic.port = d.port;
      //  that.$rootScope.settings.subsonic.use_ssl = d.use_ssl;
      //  that.$rootScope.settings.subsonic.include_port_in_url = d.include_port_in_url;
      //
      //  that.SubsonicService.login();
      //}


      if (settings) {
        if (settings.key === 'sabnzbd_settings') {
          $rootScope.settings.sabnzbd = {};
          $rootScope.settings.sabnzbd.sabnzbd_host = settings.data.sabnzbd_host;
          $rootScope.settings.sabnzbd.sabnzbd_port = settings.data.sabnzbd_port;
          $rootScope.settings.sabnzbd.sabnzbd_use_ssl = settings.data.sabnzbd_use_ssl;
          $rootScope.settings.sabnzbd.sabnzbd_url_base = settings.data.sabnzbd_url_base;
          $rootScope.settings.sabnzbd.sabnzbd_apikey = settings.data.sabnzbd_apikey;
          $rootScope.settings.sabnzbd.sabnzbd_include_port_in_url = settings.data.sabnzbd_include_port_in_url;
          $rootScope.settings.sabnzbd.sabnzbd_username = settings.data.sabnzbd_username;
          $rootScope.settings.sabnzbd.sabnzbd_password = settings.data.sabnzbd_password;
          //that.AlloyDbService.login();
        }


        if (settings.key === 'alloydb_settings') {
          $rootScope.settings.alloydb = {};
          $rootScope.settings.alloydb.alloydb_host = settings.data.alloydb_host;
          $rootScope.settings.alloydb.alloydb_port = settings.data.alloydb_port;
          $rootScope.settings.alloydb.alloydb_apikey = settings.data.alloydb_apikey;
          $rootScope.settings.alloydb.alloydb_use_ssl = settings.data.alloydb_use_ssl;
          $rootScope.settings.alloydb.alloydb_include_port_in_url = settings.data.alloydb_include_port_in_url;
          $rootScope.settings.alloydb.alloydb_scrobble = settings.data.alloydb_scrobble;
          $rootScope.settings.alloydb.alloydb_lastfm_username = settings.data.alloydb_lastfm_username;
          $rootScope.settings.alloydb.alloydb_lastfm_password = settings.data.alloydb_lastfm_password;
          that.AlloyDbService.login();
        }

        that.AppUtilities.broadcast('settingsReloadedEvent', settings);

        that.AppUtilities.apply();
      }




    });

    this.socket.on('sabnzbd_settings_event', function (d) {

      if (d) {
        that.$rootScope.settings.sabnzbd = {};
        that.$rootScope.settings.sabnzbd.username = d.username;
        that.$rootScope.settings.sabnzbd.password = d.password;
        that.$rootScope.settings.sabnzbd.host = d.host;
        that.$rootScope.settings.sabnzbd.port = d.port;
        that.$rootScope.settings.sabnzbd.url_base = d.url_base;
        that.$rootScope.settings.sabnzbd.apikey = d.apikey;
        that.$rootScope.settings.sabnzbd.use_ssl = d.use_ssl;
        that.$rootScope.settings.sabnzbd.include_port_in_url = d.include_port_in_url;
        that.AppUtilities.broadcast('sabnzbdSettingsReloadedEvent');
        that.AppUtilities.apply();
        //that.SubsonicService.login();
      }

    });

    this.socket.on('test_sabnzbd_connection_result', function (data) {
      if (data) {
        that.AppUtilities.broadcast('sabnzbdConnectionTestResult', data);
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