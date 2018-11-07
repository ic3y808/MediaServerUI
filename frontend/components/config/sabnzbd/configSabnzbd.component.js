import CryptoJS from 'crypto-js';
class ConfigSabnzbdController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('sabnzbd-controller');
    var that = this;
    $scope.settings = {};
    $scope.saveSettings = function () {
      that.Backend.debug('save sabnzbd settings');
      $rootScope.settings.sabnzbd_host = $scope.settings.sabnzbd_host;
      $rootScope.settings.sabnzbd_port = $scope.settings.sabnzbd_port;
      $rootScope.settings.sabnzbd_use_ssl = $scope.settings.sabnzbd_use_ssl;
      $rootScope.settings.sabnzbd_url_base = $scope.settings.sabnzbd_url_base;
      $rootScope.settings.sabnzbd_apikey = $scope.settings.sabnzbd_apikey;
      $rootScope.settings.sabnzbd_include_port_in_url = $scope.settings.sabnzbd_include_port_in_url;
      $rootScope.settings.sabnzbd_username = $scope.settings.sabnzbd_username;
      $rootScope.settings.sabnzbd_password = CryptoJS.AES.encrypt($scope.settings.sabnzbd_password, "12345").toString();
      Backend.emit('save_sabnzbd_settings', $rootScope.settings);
      //sabnzbdService.login();
    };

    $rootScope.$on('sabnzbdSettingsReloadedEvent', function (event, data) {
      that.Backend.debug('sabnzbd settings reloading');
      that.$scope.settings.sabnzbd_host = that.$rootScope.settings.sabnzbd_host;
      that.$scope.settings.sabnzbd_port = that.$rootScope.settings.sabnzbd_port;
      that.$scope.settings.sabnzbd_url_base = that.$rootScope.settings.sabnzbd_url_base;
      that.$scope.settings.sabnzbd_apikey = that.$rootScope.settings.sabnzbd_apikey;
      that.$scope.settings.sabnzbd_use_ssl = !!+that.$rootScope.settings.sabnzbd_use_ssl;
      that.$scope.settings.sabnzbd_include_port_in_url = !!+that.$rootScope.settings.sabnzbd_include_port_in_url;
      that.$scope.settings.sabnzbd_username = that.$rootScope.settings.sabnzbd_username;
      if (that.$rootScope.settings.sabnzbd_password) {
        that.$scope.settings.sabnzbd_password = CryptoJS.AES.decrypt(that.$rootScope.settings.sabnzbd_password.toString(), "12345").toString(CryptoJS.enc.Utf8);
      }
      that.$scope.previewConnectionString();
      that.AppUtilities.hideLoader();
    });

    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($scope.settings.sabnzbd_use_ssl)
        url = 'https://';
      url += $scope.settings.sabnzbd_host;
      if ($scope.settings.sabnzbd_include_port_in_url)
        url += ':' + $scope.settings.sabnzbd_port;

      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    Backend.emit('load_sabnzbd_settings');
    
    $rootScope.$on('menuSizeChange', function (event, currentState) {
      
    });

    $rootScope.$on('windowResized', function (event, data) {

    });
  }
}

export default {
  bindings: {},
  controller: ConfigSabnzbdController,
  templateUrl: '/template/configSabnzbd.pug',
  
};