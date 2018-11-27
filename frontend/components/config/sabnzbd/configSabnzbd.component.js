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

    $scope.testSettings = function () {
      Backend.emit('test_sabnzbd_settings', $scope.settings);
    };

    $scope.saveSettings = function () {
      that.Backend.debug('save sabnzbd settings');
      $rootScope.settings.sabnzbd = {};
      $rootScope.settings.sabnzbd.host = $scope.settings.sabnzbd_host;
      $rootScope.settings.sabnzbd.port = $scope.settings.sabnzbd_port;
      $rootScope.settings.sabnzbd.use_ssl = $scope.settings.sabnzbd_use_ssl;
      $rootScope.settings.sabnzbd.url_base = $scope.settings.sabnzbd_url_base;
      $rootScope.settings.sabnzbd.apikey = $scope.settings.sabnzbd_apikey;
      $rootScope.settings.sabnzbd.include_port_in_url = $scope.settings.sabnzbd_include_port_in_url;
      $rootScope.settings.sabnzbd.username = $scope.settings.sabnzbd_username;
      $rootScope.settings.sabnzbd.password = CryptoJS.AES.encrypt($scope.settings.sabnzbd_password, "12345").toString();
      Backend.emit('save_sabnzbd_settings', $rootScope.settings.sabnzbd);
      that.$rootScope.triggerConfigAlert("Saved!", 'success');
      //sabnzbdService.login();
    };

    $rootScope.$on('sabnzbdSettingsReloadedEvent', function (event, data) {
      that.Backend.debug('sabnzbd settings reloading');
      if (that.$rootScope.settings.sabnzbd) {
        that.$scope.settings.sabnzbd_host = that.$rootScope.settings.sabnzbd.host;
        that.$scope.settings.sabnzbd_port = that.$rootScope.settings.sabnzbd.port;
        that.$scope.settings.sabnzbd_url_base = that.$rootScope.settings.sabnzbd.url_base;
        that.$scope.settings.sabnzbd_apikey = that.$rootScope.settings.sabnzbd.apikey;
        that.$scope.settings.sabnzbd_use_ssl = !!+that.$rootScope.settings.sabnzbd.use_ssl;
        that.$scope.settings.sabnzbd_include_port_in_url = !!+that.$rootScope.settings.sabnzbd.include_port_in_url;
        that.$scope.settings.sabnzbd_username = that.$rootScope.settings.sabnzbd.username;
        if (that.$rootScope.settings.sabnzbd.password) {
          that.$scope.settings.sabnzbd_password = CryptoJS.AES.decrypt(that.$rootScope.settings.sabnzbd.password.toString(), "12345").toString(CryptoJS.enc.Utf8);
        }
      }

      that.$scope.previewConnectionString();
      that.AppUtilities.hideLoader();
    });

    $rootScope.$on('sabnzbdConnectionTestResult', function (event, data) {
      that.Backend.debug('sabnzbd connection result');
      that.Backend.debug(data);
      if (data) {
        if (data.result === 'Success!') {
          that.$rootScope.triggerConfigAlert(data.result, 'primary');
        } else {
          that.$rootScope.triggerConfigAlert(data.result, 'danger');
        }
      }
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
  templateUrl: '/template/configSabnzbd.jade',

};