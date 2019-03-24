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

    $scope.settings = {};
    $scope.currentpath = '';
    $scope.display_name = '';
  
    $scope.generateConnectionString = () =>  {
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

    $scope.previewConnectionString = () =>  {
      $scope.connectionStringPreview = $scope.generateConnectionString();
    };

    $scope.testSettings = () => {
      if(this.$rootScope.socket)
       this.$rootScope.socket.emit('test_alloydb_settings', $rootScope.settings.sabnzbd);
    };

    $scope.removePath = mediaPath => {
      var removeMediaPath = AlloyDbService.removeMediaPath(mediaPath);
      if(removeMediaPath){
        removeMediaPath.then(function(result){
          $scope.reload();
        });
      }
    }

    $scope.browsePaths = () =>  {
      $scope.currentpath = '';
      $scope.display_name = '';
      AppUtilities.apply();

      var $this = $(this)
              , $remote = $this.data('remote') || $this.attr('href')
              , $modal = $('#addMediaPathModal')
            $('#primary-content').append($modal);
            $modal.modal();
           // $modal.load($remote);

     // $('#addMediaPathModal').modal()
    }

    $scope.addCurrentPath = () =>  {
      var addMediaPath = AlloyDbService.addMediaPath({ display_name: $scope.display_name, path: $scope.currentpath });
      if(addMediaPath){
        addMediaPath.then(result => {

          $scope.reload();
        });
      }
      $('#addMediaPathModal').modal('hide')
    }

    $scope.reload = () =>  {
      if (AlloyDbService.isLoggedIn) {
        var mediaPaths = AlloyDbService.getMediaPaths();
        if (mediaPaths) {
          mediaPaths.then(paths => {
            $scope.mediaPaths = paths;
            AppUtilities.apply();
            AppUtilities.hideLoader();
          });
        }
      }
    }

    if(this.$rootScope.socket)
       this.$rootScope.socket.emit('load_settings', 'alloydb_settings');

    $rootScope.$on('menuSizeChange', (event, currentState) =>  {

    });

    $rootScope.$on('windowResized', (event, data) =>  {

    });


    AppUtilities.hideLoader();

    $rootScope.$watch('settings.alloydb ', (newVal, oldVal) =>  {
      $scope.previewConnectionString();
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.reload();
    });

    $scope.reload();
  }
}

export default {
  bindings: {},
  controller: ConfigAlloyDbController,
  templateUrl: '/template/configAlloyDb.jade'
};