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

    this.socket.on('settings_event', function (data) {
      if (data) {

        var d = data[0];
        if (d) {
          that.$rootScope.settings = {
            "subsonic_username": d.subsonic_username,
            "subsonic_password": d.subsonic_password,
            "subsonic_address": d.subsonic_address,
            "subsonic_port": d.subsonic_port,
            "subsonic_use_ssl": d.subsonic_use_ssl,
            "subsonic_include_port_in_url": d.subsonic_include_port_in_url
          };
          that.AppUtilities.broadcast('settingsReloadedEvent');
          that.AppUtilities.apply();
          that.SubsonicService.login();
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