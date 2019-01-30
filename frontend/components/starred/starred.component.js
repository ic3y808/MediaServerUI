import './starred.scss';
class StarredController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('starred-controller');
    this.AppUtilities.showLoader();
    var that = this;

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.findNowPlaying = function (id) {
      $rootScope.fresh_albums.forEach(function (album) {

      });
    }

    $scope.getAlbum = function (album) {
      that.$scope.tracks = album.tracks;

      if ($scope.play_prev_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack($scope.tracks.length - 1);
        $scope.play_prev_album = false;
      }

      if ($scope.play_next_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack(0);
        $scope.play_next_album = false;
      }

      
    }

    $scope.refresh = function () {
      AlloyDbService.refreshStarred();
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      $rootScope.tracks = AppUtilities.shuffle($rootScope.starred_tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$watch('starred_tracks', function (newVal, oldVal) {
      if ($rootScope.starred_tracks) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      }
    });

    $rootScope.$watch('starred_albums', function (newVal, oldVal) {
      if ($rootScope.starred_albums) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({
            playlist: $rootScope.starred_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });

            this.on('click', function (index, link) {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });
          });
        });
      }

    });

  }

}

export default {
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};