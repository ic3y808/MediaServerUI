import CryptoJS from 'crypto-js';

export default class SubsonicService {
  constructor($rootScope, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }

  generateConnectionString () {
    var url = 'http://';
    if ($scope.settings.sabnzbd_use_ssl)
      url = 'https://';
    url += $scope.settings.sabnzbd_host;
    if ($scope.settings.sabnzbd_include_port_in_url)
      url += ':' + $scope.settings.sabnzbd_port;

    return url;
  }
}