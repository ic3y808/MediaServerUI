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
      $rootScope.settings.sabnzbd.sabnzbd_host = $scope.settings.sabnzbd_host;
      $rootScope.settings.sabnzbd.sabnzbd_port = $scope.settings.sabnzbd_port;
      $rootScope.settings.sabnzbd.sabnzbd_use_ssl = $scope.settings.sabnzbd_use_ssl;
      $rootScope.settings.sabnzbd.sabnzbd_url_base = $scope.settings.sabnzbd_url_base;
      $rootScope.settings.sabnzbd.sabnzbd_apikey = $scope.settings.sabnzbd_apikey;
      $rootScope.settings.sabnzbd.sabnzbd_include_port_in_url = $scope.settings.sabnzbd_include_port_in_url;
      $rootScope.settings.sabnzbd.sabnzbd_username = $scope.settings.sabnzbd_username;
      $rootScope.settings.sabnzbd.sabnzbd_password = CryptoJS.AES.encrypt($scope.settings.sabnzbd_password, "12345").toString();
      Backend.emit('save_settings', { key: 'sabnzbd_settings', data: $rootScope.settings.sabnzbd });
      setTimeout(() => {
        Backend.emit('sabnzbd_reset_settings');
      }, 300);
      that.$rootScope.triggerConfigAlert("Saved!", 'success');
      //sabnzbdService.login();
    };


    $rootScope.$on('settingsReloadedEvent', function (event, settings) {

      if (settings.key === 'sabnzbd_settings') {
        Backend.debug('sabnzbd settings reloading');
        $scope.settings.sabnzbd_host = $rootScope.settings.sabnzbd.sabnzbd_host;
        $scope.settings.sabnzbd_port = $rootScope.settings.sabnzbd.sabnzbd_port;
        $scope.settings.sabnzbd_url_base = $rootScope.settings.sabnzbd.sabnzbd_url_base;
        $scope.settings.sabnzbd_apikey = $rootScope.settings.sabnzbd.sabnzbd_apikey;
        $scope.settings.sabnzbd_use_ssl = $rootScope.settings.sabnzbd.sabnzbd_use_ssl;
        $scope.settings.sabnzbd_include_port_in_url = $rootScope.settings.sabnzbd.sabnzbd_include_port_in_url;
        $scope.settings.sabnzbd_username = $rootScope.settings.sabnzbd.sabnzbd_username;
        if ($rootScope.settings.sabnzbd.sabnzbd_password) {
          $scope.settings.sabnzbd_password = CryptoJS.AES.decrypt($rootScope.settings.sabnzbd.sabnzbd_password.toString(), "12345").toString(CryptoJS.enc.Utf8);
        }
        $scope.previewConnectionString();
        AppUtilities.hideLoader();
      }


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
      if ($scope.settings.sabnzbd_url_base)
        url += '/' + $scope.settings.sabnzbd_url_base;
      url += '/api';

      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    Backend.emit('load_settings', 'sabnzbd_settings');

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