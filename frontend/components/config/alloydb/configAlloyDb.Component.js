class ConfigAlloyDbController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('config-alloydb-controller');
    var that = this;
    $scope.settings = {};
  
    $scope.generateConnectionString = function () {
      var url = 'http://';
      if ($rootScope.settings.alloydb) {
        if ($rootScope.settings.alloydb.alloydb_use_ssl)
          url = 'https://';
        url += $rootScope.settings.alloydb.alloydb_host;
        if ($rootScope.settings.alloydb.alloydb_include_port_in_url)
          url += ':' + $rootScope.settings.alloydb.alloydb_port;
      }


      return url;
    };

    $scope.previewConnectionString = function () {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    if(this.$rootScope.socket)
       this.$rootScope.socket.emit('load_settings', 'alloydb_settings');

    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });


    AppUtilities.hideLoader();

    $rootScope.$watch('settings.alloydb ', function (newVal, oldVal) {
      $scope.previewConnectionString();
    });
  }
}

export default {
  bindings: {},
  controller: ConfigAlloyDbController,
  templateUrl: '/template/configAlloyDb.jade'
};