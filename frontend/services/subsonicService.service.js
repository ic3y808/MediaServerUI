import CryptoJS from 'crypto-js';

export default class SubsonicService {
  constructor($rootScope, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }

  doLogin() {

    if (this.$rootScope.settings && this.$rootScope.settings.subsonic.username && this.$rootScope.settings.subsonic.password) {
      if (!this.isLoggedIn) {
        console.log('logging into subsonic')

        var ip = this.$rootScope.settings.subsonic.host;
        if (this.$rootScope.settings.subsonic.include_port_in_url === true)
          ip = ip + ':' + this.$rootScope.settings.subsonic.port;
        this.subsonic = new SubsonicAPI({
          https: this.$rootScope.settings.subsonic.use_ssl,
          ip: ip,
          port: this.$rootScope.settings.subsonic.port,
          user: this.$rootScope.settings.subsonic.username,
          password: CryptoJS.AES.decrypt(this.$rootScope.settings.subsonic.password.toString(), "12345").toString(CryptoJS.enc.Utf8),
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