import './albums.scss';
class AlbumsController {
  constructor($scope, $rootScope, $location, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('albums-controller');
    this.AppUtilities.showNoRows();
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