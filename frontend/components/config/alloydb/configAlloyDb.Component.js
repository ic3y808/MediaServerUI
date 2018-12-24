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
        $scope.saveSettings = function() {
            that.Backend.debug('save settings');
            $rootScope.settings.alloydb = {};
            $rootScope.settings.alloydb.alloydb_host = $scope.settings.alloydb_host;
            $rootScope.settings.alloydb.alloydb_port = $scope.settings.alloydb_port;
            $rootScope.settings.alloydb.alloydb_apikey = $scope.settings.alloydb_apikey;
            $rootScope.settings.alloydb.alloydb_use_ssl = $scope.settings.alloydb_use_ssl;
            $rootScope.settings.alloydb.alloydb_include_port_in_url = $scope.settings.alloydb_include_port_in_url;
            Backend.emit('save_settings', { key: 'alloydb_settings', data: $rootScope.settings.alloydb });
            that.$rootScope.triggerConfigAlert("Saved!", 'success');
            AlloyDbService.login();
        };

        $rootScope.$on('settingsReloadedEvent', function(event, settings) {
            that.Backend.debug('settings reloading');
            if (settings.key === 'alloydb_settings') {
                $scope.settings.alloydb_host = $rootScope.settings.alloydb.alloydb_host;
                $scope.settings.alloydb_port = $rootScope.settings.alloydb.alloydb_port;
                $scope.settings.alloydb_apikey = $rootScope.settings.alloydb.alloydb_apikey;
                $scope.settings.alloydb_use_ssl = $rootScope.settings.alloydb.alloydb_use_ssl;
                $scope.settings.alloydb_include_port_in_url = $rootScope.settings.alloydb.alloydb_include_port_in_url;
                $scope.previewConnectionString();
                AppUtilities.hideLoader();
            }
        });

        $scope.generateConnectionString = function() {
            var url = 'http://';
            if ($scope.settings.alloydb_use_ssl)
                url = 'https://';
            url += $scope.settings.alloydb_host;
            if ($scope.settings.alloydb_include_port_in_url)
                url += ':' + $scope.settings.alloydb_port;

            return url;
        };

        $scope.previewConnectionString = function() {
            $scope.connectionStringPreview = $scope.generateConnectionString();
        };

        Backend.emit('load_settings', 'alloydb_settings');

        $rootScope.$on('menuSizeChange', function(event, currentState) {

        });

        $rootScope.$on('windowResized', function(event, data) {

        });
    }
}

export default {
    bindings: {},
    controller: ConfigAlloyDbController,
    templateUrl: '/template/configAlloyDb.jade'
};