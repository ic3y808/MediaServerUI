import CryptoJS from 'crypto-js';

class ConfigAlloyDbController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('config-alloydb-controller');
    var that = this;
    $scope.settings = {};
    $scope.saveSettings = function () {
      that.Backend.debug('save settings');
      $rootScope.settings.alloydb = {};
      $rootScope.settings.alloydb.alloydb_host = $scope.settings.alloydb_host;
      $rootScope.settings.alloydb.alloydb_port = $scope.settings.alloydb_port;
      $rootScope.settings.alloydb.alloydb_apikey = $scope.settings.alloydb_apikey;
      $rootScope.settings.alloydb.alloydb_use_ssl = $scope.settings.alloydb_use_ssl;

      $rootScope.settings.alloydb.alloydb_include_port_in_url = $scope.settings.alloydb_include_port_in_url;
      $rootScope.settings.alloydb.alloydb_scrobble = $scope.settings.alloydb_scrobble;
      $rootScope.settings.alloydb.alloydb_love_tracks = $scope.settings.alloydb_love_tracks;
      $rootScope.settings.alloydb.alloydb_lastfm_username = $scope.settings.alloydb_lastfm_username;

      $rootScope.settings.alloydb.alloydb_lastfm_password = CryptoJS.AES.encrypt($scope.settings.alloydb_lastfm_password, "12345").toString();

      Backend.emit('save_settings', { key: 'alloydb_settings', data: $rootScope.settings.alloydb });
      that.$rootScope.triggerConfigAlert("Saved!", 'success');
      AlloyDbService.login();
      AlloyDbService.lastFmLogin($rootScope.settings.alloydb.alloydb_lastfm_username, $scope.settings.alloydb_lastfm_password);
    };

    $rootScope.$on('settingsReloadedEvent', function (event, settings) {
      that.Backend.debug('settings reloading');
      if (settings.key === 'alloydb_settings') {
        $scope.settings.alloydb_host = $rootScope.settings.alloydb.alloydb_host;
        $scope.settings.alloydb_port = $rootScope.settings.alloydb.alloydb_port;
        $scope.settings.alloydb_apikey = $rootScope.settings.alloydb.alloydb_apikey;
        $scope.settings.alloydb_use_ssl = $rootScope.settings.alloydb.alloydb_use_ssl;
        $scope.settings.alloydb_include_port_in_url = $rootScope.settings.alloydb.alloydb_include_port_in_url;

        $scope.settings.alloydb_scrobble = $rootScope.settings.alloydb.alloydb_scrobble;
        $scope.settings.alloydb_love_tracks = $rootScope.settings.alloydb.alloydb_love_tracks;
        $scope.settings.alloydb_lastfm_username = $rootScope.settings.alloydb.alloydb_lastfm_username;

        if ($rootScope.settings.alloydb.alloydb_lastfm_password) {
          $scope.settings.alloydb_lastfm_password = CryptoJS.AES.decrypt($rootScope.settings.alloydb.alloydb_lastfm_password.toString(), "12345").toString(CryptoJS.enc.Utf8);
        }

        $scope.previewConnectionString();
        AppUtilities.hideLoader();
      }
    });

    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($scope.settings.alloydb_use_ssl)
        url = 'https://';
      url += $scope.settings.alloydb_host;
      if ($scope.settings.alloydb_include_port_in_url)
        url += ':' + $scope.settings.alloydb_port;

      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    Backend.emit('load_settings', 'alloydb_settings');

    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });
  }
}

export default {
  bindings: {},
  controller: ConfigAlloyDbController,
  templateUrl: '/template/configAlloyDb.jade'
};