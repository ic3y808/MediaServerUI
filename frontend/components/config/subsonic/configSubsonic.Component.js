import CryptoJS from 'crypto-js';

class ConfigSubsonicController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('settings-controller');
    var that = this;
    $scope.settings = {};
    $scope.saveSettings = function () {
      that.Backend.debug('save settings');
      $rootScope.settings.subsonic_address = $scope.settings.subsonic_address;
      $rootScope.settings.subsonic_port = $scope.settings.subsonic_port;
      $rootScope.settings.subsonic_use_ssl = $scope.settings.subsonic_use_ssl;
      $rootScope.settings.subsonic_include_port_in_url = $scope.settings.subsonic_include_port_in_url;
      $rootScope.settings.subsonic_username = $scope.settings.subsonic_username;
      $rootScope.settings.subsonic_password = CryptoJS.AES.encrypt($scope.settings.subsonic_password, "12345").toString();
      Backend.emit('save_subsonic_settings', $rootScope.settings);
      SubsonicService.login();
    };

    $rootScope.$on('subsonicSettingsReloadedEvent', function (event, data) {
      that.Backend.debug('settings reloading');
      $scope.settings.subsonic_address = $rootScope.settings.subsonic_address;
      $scope.settings.subsonic_port = $rootScope.settings.subsonic_port;
      $scope.settings.subsonic_use_ssl = !!+$rootScope.settings.subsonic_use_ssl;
      $scope.settings.subsonic_include_port_in_url = !!+$rootScope.settings.subsonic_include_port_in_url;
      $scope.settings.subsonic_username = $rootScope.settings.subsonic_username;
      if ($rootScope.settings.subsonic_password) {
        $scope.settings.subsonic_password = CryptoJS.AES.decrypt($rootScope.settings.subsonic_password.toString(), "12345").toString(CryptoJS.enc.Utf8);
      }
      $scope.previewConnectionString();
      AppUtilities.hideLoader();
    });

    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($scope.settings.subsonic_use_ssl)
        url = 'https://';
      url += $scope.settings.subsonic_address;
      if ($scope.settings.subsonic_include_port_in_url)
        url += ':' + $scope.settings.subsonic_port;

      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    Backend.emit('load_subsonic_settings');
    
    $rootScope.$on('menuSizeChange', function (event, currentState) {
      
    });

    $rootScope.$on('windowResized', function (event, data) {

    });
  }
}

export default {
  bindings: {},
  controller: ConfigSubsonicController,
  templateUrl: '/template/configSubsonic.pug',
  
};