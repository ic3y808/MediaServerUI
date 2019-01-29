import './genres.scss';
class GenresController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('genres-controller');
    this.AppUtilities.showNoRows();
    this.AppUtilities.showLoader();
    
    $scope.refresh = function () {
      AlloyDbService.refreshGenres();
    };

    $rootScope.$watch('genres', function (newVal, oldVal) {
      if ($rootScope.genres) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: GenresController,
  templateUrl: '/template/genres.jade'
};