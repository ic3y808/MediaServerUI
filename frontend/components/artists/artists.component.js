import './artists.scss';
class ArtistsController {
  constructor($scope, $rootScope, $timeout, $location, $anchorScroll, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('artists-controller');
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshArtists();
    }

    $scope.jumpBarClick = function () {

    }

    $rootScope.$watch('artists', function (newVal, oldVal) {
      if ($rootScope.artists) {
        AppUtilities.apply();
        AppUtilities.hideLoader();        
      }
    });
  }
}

export default {
  bindings: {},
  controller: ArtistsController,
  templateUrl: '/template/artists.jade'
};