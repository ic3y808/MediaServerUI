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
        $('#ping').html("<code>Connected: " + JSON.parse(data).date + "</code>");
    });

    this.socket.on('subsonic_settings_event', function (data) {
      if (data) {

        var d = data[0];
        if (d) {
          that.$rootScope.settings.subsonic_username = d.subsonic_username;
          that.$rootScope.settings.subsonic_password = d.subsonic_password;
          that.$rootScope.settings.subsonic_address = d.subsonic_address;
          that.$rootScope.settings.subsonic_port = d.subsonic_port;
          that.$rootScope.settings.subsonic_use_ssl = d.subsonic_use_ssl;
          that.$rootScope.settings.subsonic_include_port_in_url = d.subsonic_include_port_in_url;
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
          that.$rootScope.settings.sabnzbd_username = d.sabnzbd_username;
          that.$rootScope.settings.sabnzbd_password = d.sabnzbd_password;
          that.$rootScope.settings.sabnzbd_host = d.sabnzbd_host;
          that.$rootScope.settings.sabnzbd_port = d.sabnzbd_port;
          that.$rootScope.settings.sabnzbd_url_base = d.sabnzbd_url_base;
          that.$rootScope.settings.sabnzbd_apikey = d.sabnzbd_apikey;
          that.$rootScope.settings.sabnzbd_use_ssl = d.sabnzbd_use_ssl;
          that.$rootScope.settings.sabnzbd_include_port_in_url = d.sabnzbd_include_port_in_url;
          that.AppUtilities.broadcast('sabnzbdSettingsReloadedEvent');
          that.AppUtilities.apply();
          //that.SubsonicService.login();
        }
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
    if (data) console.log(data);
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