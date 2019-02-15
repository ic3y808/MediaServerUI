import "./fresh.scss";

class FreshController {
  constructor($scope, $rootScope, $timeout, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("fresh-controller");
    this.AppUtilities.showLoader();
    var that = this;

    $scope.refreshing = false;

    $scope.tracks = [];

    $scope.continousPlay = true;

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    };

    $scope.findNowPlaying = function (id) {
      $rootScope.fresh_albums.forEach(function (album) { });
    };

    $scope.getAlbum = function (album) {
      that.$scope.tracks = album.tracks;
      $timeout(function () {
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

        that.AppUtilities.apply();
      });
    };

    $scope.findNowPlaying = function () {
      var found = false;
      for (var i = 0; i < $rootScope.fresh_albums.length; i++) {
        if (found) return;
        var album = $rootScope.fresh_albums[i];
        album.tracks.forEach(function (track) {
          if (found) return;
          if (MediaPlayer.checkIfNowPlaying(track)) {
            $scope.coverflow.to(i);
            found = true;
          }
        });
      }
    };

    $scope.refresh = function () {
      AlloyDbService.refreshFresh();
    };

    $scope.startRadio = function () {
      var track = that.MediaPlayer.selectedTrack();
      if (!track || !track.artistId) {
        track = $scope.tracks[0];
      }

      AlloyDbService.getSimilarSongs2(track.artistId).then(function (
        similarSongs
      ) {
        that.Logger.debug("starting radio");
        if (similarSongs && similarSongs.song) {
          $rootScope.tracks = similarSongs.song;
          MediaPlayer.loadTrack(0);
        }
      });
    };

    $scope.shuffle = function () {
      that.Logger.debug("shuffle play");
      $rootScope.tracks = AppUtilities.shuffle($scope.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on("playlistBeginEvent", function (event, data) {
      if ($scope.continousPlay) {
        $scope.play_prev_album = true;
        $scope.coverflow.prev();
      }
    });

    $rootScope.$on("playlistEndEvent", function (event, data) {
      if ($scope.continousPlay) {
        $scope.play_next_album = true;
        $scope.coverflow.next();
      }
    });

    $rootScope.$watch("fresh_albums", function (newVal, oldVal) {
      if ($rootScope.fresh_albums) {
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow("player")
            .setup({
              playlist: $rootScope.fresh_albums,
              width: "100%",
              coverwidth: 200,
              coverheight: 200,
              fixedsize: true
            })
            .on("ready", function () {
              this.on("focus", function (index) {
                if (
                  $rootScope.fresh_albums &&
                  $rootScope.fresh_albums.length > 0
                ) {
                  $scope.getAlbum($rootScope.fresh_albums[index]);
                }
              });

              this.on("click", function (index, link) {
                if (
                  $rootScope.fresh_albums &&
                  $rootScope.fresh_albums.length > 0
                ) {
                  $scope.getAlbum($rootScope.fresh_albums[index]);
                }
              });
            });

          if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
            $scope.getAlbum($rootScope.fresh_albums[0]);
            $scope.findNowPlaying();
          }

          $scope.refreshing = false;
        });
      }
    });
  }
}

export default {
  bindings: {},
  controller: FreshController,
  templateUrl: "/template/fresh.jade"
};
