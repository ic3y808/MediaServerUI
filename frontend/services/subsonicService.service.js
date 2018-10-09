import CryptoJS from 'crypto-js';

export default class SubsonicService {
  constructor($rootScope) {
    this.$rootScope = $rootScope;
    this.$rootScope.isLoggingIn = true;
    this.$rootScope.isLoggedIn = false;
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
      if (!this.$rootScope.isLoggedIn) {
        console.log('logging into subsonic')

        var ip = this.$rootScope.settings.subsonic_address;
        if (this.$rootScope.settings.subsonic_include_port_in_url === true)
          ip = ':' + this.$rootScope.settings.subsonic_port;
          this.$rootScope.subsonic = new SubsonicAPI({
          https: this.$rootScope.settings.subsonic_use_ssl,
          ip: ip,
          port: this.$rootScope.settings.subsonic_port,
          user: this.$rootScope.settings.subsonic_username,
          password: CryptoJS.AES.decrypt(this.$rootScope.settings.subsonic_password.toString(), "12345").toString(CryptoJS.enc.Utf8),
          appName: 'MediaServerUI',
          md5Auth: true
        });

        document.addEventListener('subsonicApi-ready', event => {
          if (event.detail.status === 'ok') {
            console.log('connected to subsonic')
            this.$rootScope.isLoggingIn = false;
            this.$rootScope.isLoggedIn = true;
          } else {
            console.log('failed to connect to subsonic')
            this.$rootScope.isLoggingIn = false;
            this.$rootScope.isLoggedIn = false;
          }
          this.$rootScope.$broadcast('loginStatusChange', this.$rootScope.isLoggedIn);
        });
      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    doLogin();
    if (this.$rootScope.isLoggedIn)
      return this.$rootScope.subsonic.ping();
    else return false;
  }
}