class IndexController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('index-controller')
    $scope.artists = [];


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
    }

    $scope.reloadArtists = function () {
      if ($rootScope.isLoggedIn) {
        $scope.artists = [];
        $rootScope.subsonic.getArtists().then(function (result) {
          $scope.artists = result;
          $scope.$apply();
          $rootScope.hideLoader();
        });
      } else{
        if ($scope.gridOptions.api)
        $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready')
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