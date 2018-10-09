import CryptoJS from 'crypto-js';

class SettingsController {
  constructor($scope, $rootScope, SubsonicService) {
    "ngInject";

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('settings-controller')
    $scope.settings = {};

    $scope.saveSettings = function () {
      console.log('save settings');
      $rootScope.settings.subsonic_address = $scope.settings.subsonic_address;
      $rootScope.settings.subsonic_port = $scope.settings.subsonic_port;
      $rootScope.settings.subsonic_use_ssl = $scope.settings.subsonic_use_ssl;
      $rootScope.settings.subsonic_include_port_in_url = $scope.settings.subsonic_include_port_in_url;
      $rootScope.settings.subsonic_username = $scope.settings.subsonic_username;
      $rootScope.settings.subsonic_password = CryptoJS.AES.encrypt($scope.settings.subsonic_password, "12345").toString();
      $rootScope.socket.emit('save_settings', $rootScope.settings);
      SubsonicService.login();
    }

    $rootScope.$on('settingsReloadedEvent', function (event, data) {
      console.log('settings reloading');
      $scope.settings.subsonic_address = $rootScope.settings.subsonic_address;
      $scope.settings.subsonic_port = $rootScope.settings.subsonic_port;
      $scope.settings.subsonic_use_ssl = !!+$rootScope.settings.subsonic_use_ssl;
      $scope.settings.subsonic_include_port_in_url = !!+$rootScope.settings.subsonic_include_port_in_url;
      $scope.settings.subsonic_username = $rootScope.settings.subsonic_username;
      if ($rootScope.settings.subsonic_password) {
        $scope.settings.subsonic_password = CryptoJS.AES.decrypt($rootScope.settings.subsonic_password.toString(), "12345").toString(CryptoJS.enc.Utf8);
      }
      $scope.previewConnectionString();
    });

    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($scope.settings.subsonic_use_ssl)
        url = 'https://';
      url += $scope.settings.subsonic_address;
      if ($scope.settings.subsonic_include_port_in_url)
        url += ':' + $scope.settings.subsonic_port;

      return url;
    }

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
      $scope.$apply();
    }

    $rootScope.socket.emit('load_settings');
    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
  }
}

export default {
  bindings: {},
  controller: SettingsController,
  templateUrl: '/template/settings.jade'
};