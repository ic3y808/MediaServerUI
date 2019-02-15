import './genres.scss';
class GenresController {
  constructor($scope, $rootScope, $location, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('genres-controller');
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