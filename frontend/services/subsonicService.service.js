import CryptoJS from 'crypto-js';

export default class SubsonicService {
  constructor($rootScope, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }

  generateConnectionString() {
    var url = 'http://';
    if ($rootScope.settings.subsonic_use_ssl)
      url = 'https://';
    url += $rootScope.settings.subsonic_address;
    if ($rootScope.settings.subsonic_include_port_in_url)
      url += ':' + $rootScope.settings.subsonic_port;

    return url;
  }

  doLogin() {

    if (this.$rootScope.settings && this.$rootScope.settings.subsonic_username && this.$rootScope.settings.subsonic_password) {
      if (!this.isLoggedIn) {
        console.log('logging into subsonic')

        var ip = this.$rootScope.settings.subsonic_address;
        if (this.$rootScope.settings.subsonic_include_port_in_url === true)
          ip = ':' + this.$rootScope.settings.subsonic_port;
          this.subsonic = new SubsonicAPI({
          https: this.$rootScope.settings.subsonic_use_ssl,
          ip: ip,
          port: this.$rootScope.settings.subsonic_port,
          user: this.$rootScope.settings.subsonic_username,
          password: CryptoJS.AES.decrypt(this.$rootScope.settings.subsonic_password.toString(), "12345").toString(CryptoJS.enc.Utf8),
          appName: 'Alloy',
          md5Auth: true
        });

        var that = this;

        document.addEventListener('subsonicApi-ready', event => {
          if (event.detail.status === 'ok') {
            console.log('connected to subsonic')
            that.isLoggingIn = false;
            that.isLoggedIn = true;
          } else {
            console.log('failed to connect to subsonic')
            that.isLoggingIn = false;
            that.isLoggedIn = false;
          }
          that.AppUtilities.broadcast('loginStatusChange', that.isLoggedIn);
        });
      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.subsonic.ping();
    else return false;
  }
}