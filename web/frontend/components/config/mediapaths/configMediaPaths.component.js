class ConfigMediaPathsController {
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
    this.Logger.debug("config-mediapaths-controller");

    $scope.settings = {};
    $scope.currentpath = "";
    $scope.display_name = "";

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

    $scope.removePath = mediaPath => {
      var removeMediaPath = AlloyDbService.removeMediaPath(mediaPath);
      if(removeMediaPath){
        removeMediaPath.then(function(result){
          $scope.reload();
        });
      }
    }

    $scope.browsePaths = () =>  {
      $scope.currentpath = "";
      $scope.display_name = "";
      AppUtilities.apply();
      $("#addMediaPathModal").modal()
    }

    $scope.addCurrentPath = () =>  {
      var addMediaPath = AlloyDbService.addMediaPath({ display_name: $scope.display_name, path: $scope.currentpath });
      if(addMediaPath){
        addMediaPath.then(result => {

          $scope.reload();
        });
      }
      $("#addMediaPathModal").modal("hide")
    }

    $rootScope.$on("loginStatusChange", function (event, data) {
      $scope.reload();
    });

    $scope.reload();
  }
}

export default {
  bindings: {},
  controller: ConfigMediaPathsController,
  templateUrl: "/template/configMediaPaths.jade"
};