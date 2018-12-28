import './home.scss';
class HomeController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('home-controller');
    var that = this;

    $scope.processTracks = function (songCollection, callback) {
      var songs = [];
      songCollection.forEach(song => {

        if (song.cover_art) {
          that.AlloyDbService.getCoverArt(song.cover_art).then(function (art) {
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
      if (that.AlloyDbService.isLoggedIn) {
        $scope.random = [];
        that.AlloyDbService.getRandomSongs().then(function (result) {
          $scope.processTracks(result.song, function (results) {
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });

        });


      }
    };




    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Home reload on loginsatuschange');
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
  templateUrl: '/template/home.jade'
};