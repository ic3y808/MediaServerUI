import "./fresh.scss";

class FreshController {
  constructor($scope, $rootScope, $timeout, $element, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$element = $element;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("fresh-controller");
    this.AppUtilities.showLoader();

    $scope.refreshing = false;

    $scope.tracks = [];

    $scope.continousPlay = true;

    $scope.toggleContinousPlay = () => {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = (id) => {
      return this.AlloyDbService.getCoverArt(id);
    };

    $scope.findNowPlaying = (fid) => {
      $rootScope.fresh_albums.forEach((album) => { });
    };

    $scope.checkIfNowPlaying = (type, id) => {
      var selected = this.MediaPlayer.selectedTrack();
      if (selected && type && id) {
        if (type === "track") {
          return id === selected.id;
        } else if (type === "artist") {
          return id === selected.artist_id;
        } else if (type === "album") {
          return id === selected.album_id;
        }
      }
      return false;
    };


    $scope.playTrack = (song, playlist) => {
      this.Logger.debug("Play Track");
      $rootScope.tracks = playlist;
      var index = _.findIndex($rootScope.tracks, function (track) {
        return track.id === song.id;
      });
      this.MediaPlayer.loadTrack(index);
    };

    $scope.playAlbum = (album) => {
      this.Logger.debug("Play Album");
      $rootScope.tracks = album.tracks;
      this.MediaPlayer.loadTrack(0);
    };

    $scope.playArtist = (artist) => {
      this.Logger.debug("Play Album");
      $rootScope.tracks = AppUtilities.shuffle(artist.tracks);
      this.MediaPlayer.loadTrack(0);
    };

    $scope.refresh = () => {
      this.AlloyDbService.refreshFresh();
      this.AlloyDbService.refreshCharts();
    };

    $scope.isPlaying = () => this.MediaPlayer.playing && !this.MediaPlayer.paused;

    $scope.startRadio = () => {
      var track = this.MediaPlayer.selectedTrack();
      if (!track || !track.artistId) {
        track = $scope.tracks[0];
      }

      AlloyDbService.getSimilarSongs2(track.artistId).then((similarSongs) => {
        this.Logger.debug("starting radio");
        if (similarSongs && similarSongs.song) {
          $rootScope.tracks = similarSongs.song;
          MediaPlayer.loadTrack(0);
        }
      });
    };

    $rootScope.$on("playlistBeginEvent", (event, data) => {
     
    });

    $rootScope.$on("playlistEndEvent", (event, data) => {
     
    });


    $rootScope.$watch("fresh_albums", (newVal, oldVal) => {
      if ($rootScope.fresh_albums) {
        $scope.fresh_albums = $rootScope.fresh_albums.slice(0, 12);

        var albumTracks = [];
        $scope.fresh_albums.forEach((album) => {
          album.tracks.forEach((track) => {
            track.image = this.AlloyDbService.getCoverArt({ track_id: track.id });
            albumTracks.push(track);
          });
        });
        $scope.quick_picks = AppUtilities.getRandom(albumTracks, 10);
        $scope.quick_picks.forEach((track) => {
          track.image = this.AlloyDbService.getCoverArt({ track_id: track.id });
        });
        this.AppUtilities.apply();
      }
    });
    $rootScope.$watch("fresh_artists", (newVal, oldVal) => {
      if ($rootScope.fresh_artists) {
        $scope.fresh_artists = AppUtilities.getRandom($rootScope.fresh_artists, 12);
        this.AppUtilities.apply();
      }
    });
    $rootScope.$watch("fresh_tracks", (newVal, oldVal) => {
      if ($rootScope.fresh_tracks) {
        $scope.fresh_tracks = AppUtilities.getRandom($rootScope.fresh_tracks, 12);
        $scope.songs = AppUtilities.getRandom($rootScope.fresh_tracks, 12);
        $scope.extra_fresh = AppUtilities.getRandom($rootScope.fresh_tracks, 12);
        this.AppUtilities.apply();
      }
    });

    $rootScope.$watch("charts", (newVal, oldVal) => {
      if ($rootScope.charts) {
        if ($rootScope.charts.top_tracks) {
          $scope.top_tracks = AppUtilities.getRandom($rootScope.charts.top_tracks, 10);
          $scope.never_played = AppUtilities.getRandom($rootScope.charts.never_played, 10);
          this.AppUtilities.apply();
        }
      }
    });
  }

  $onInit() {
    this.$element.addClass("vbox");
  }
}

export default {
  bindings: {},
  controller: FreshController,
  templateUrl: "/template/fresh.jade"
};
