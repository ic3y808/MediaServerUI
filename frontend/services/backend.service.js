import io from 'socket.io-client';

export default class Backend {
  constructor($rootScope, AppUtilities, SubsonicService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
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
      subsonic: {},
      sabnzbd: {}
    };


    this.socket.on('subsonic_settings_event', function (data) {
      if (data) {

        var d = data[0];
        if (d) {
          that.$rootScope.settings.subsonic = {};
          that.$rootScope.settings.subsonic.username = d.username;
          that.$rootScope.settings.subsonic.password = d.password;
          that.$rootScope.settings.subsonic.host = d.host;
          that.$rootScope.settings.subsonic.port = d.port;
          that.$rootScope.settings.subsonic.use_ssl = d.use_ssl === "1";
          that.$rootScope.settings.subsonic.include_port_in_url = d.include_port_in_url === "1";
          that.AppUtilities.broadcast('subsonicSettingsReloadedEvent');
          that.AppUtilities.apply();
          that.SubsonicService.login();
        }
      }
    });

    this.socket.on('sabnzbd_settings_event', function (data) {
      if (data) {

        var d = data[0];
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