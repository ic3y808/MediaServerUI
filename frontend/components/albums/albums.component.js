import './albums.scss';
class AlbumsController {
  constructor($scope, $rootScope, $location, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('albums-controller');
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshAlbums();
    };

    $rootScope.$watch('albums', function (newVal, oldVal) {
      if ($rootScope.albums) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: AlbumsController,
  templateUrl: '/template/albums.jade'
};