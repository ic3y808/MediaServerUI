import './artists.scss';
class ArtistsController {
  constructor($scope, $rootScope, $timeout, $location, $anchorScroll, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artists-controller');
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshArtists();
    }

    $scope.jumpBarClick = function () {
      console.log('jump bar clicked');

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