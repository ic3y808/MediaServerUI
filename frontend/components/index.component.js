class IndexController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('index-controller');
    $scope.artists = [];
    var that = this;

    $scope.getArtists = function (artistsCollection, callback) {
      var artists = [];
      artistsCollection.forEach(artistHolder => {
        artistHolder.artist.forEach(artist => {
          artists.push(artist);
        });
      });

      Promise.all(artists).then(function (artistsResult) {
        callback(artistsResult);
      });
    };

    $scope.reloadArtists = function () {
      if (SubsonicService.isLoggedIn) {
        $scope.artists = [];
        that.SubsonicService.subsonic.getArtists().then(function (result) {
          $scope.artists = result;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          that.AppUtilities.hideLoader();

        });
      } else {
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.showNoRowsOverlay();
        }
        that.AppUtilities.hideLoader();
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('music reloading on subsonic ready');
      $scope.reloadArtists();
    });

    $scope.reloadArtists();
  }
}

export default {
  bindings: {},
  controller: IndexController,
  templateUrl: '/template/index-view.jade'
};