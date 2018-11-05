class HomeController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('home-controller');
    var that = this;

    $scope.processTracks = function (songCollection, callback) {
      var songs = [];
      songCollection.forEach(song => {

        if (song.coverArt) {
          that.SubsonicService.subsonic.getCoverArt(song.coverArt, 200).then(function (art) {
            // song.artworkUrl = art;
            // $scope.random.push(song);
          });
        }
      });

      Promise.all(songs).then(function (songsResult) {
        callback(songsResult);
      });
    };

    $scope.reloadRandomTracks = function () {
      if (that.SubsonicService.isLoggedIn) {
        $scope.random = [];
        that.SubsonicService.subsonic.getRandomSongs().then(function (result) {
          $scope.processTracks(result.song, function (results) {
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });

        });


      }
    };




    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('home reloading on subsonic ready');
      $scope.reloadRandomTracks();
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {


    });

    $rootScope.$on('windowResized', function (event, data) {


    });


    $scope.reloadRandomTracks();

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    
    this.AppUtilities.hideLoader();

  }
}

export default {
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.pug'
};