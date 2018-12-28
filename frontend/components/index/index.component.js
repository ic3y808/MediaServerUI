class IndexController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
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
      if (AlloyDbService.isLoggedIn) {
        $scope.artists = [];
        that.AlloyDbService.getArtists().then(function (result) {
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
      that.Backend.debug('Index reload on loginsatuschange');
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