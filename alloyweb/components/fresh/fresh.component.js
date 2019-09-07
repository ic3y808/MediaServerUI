import "./fresh.scss";
import { findIndex } from "lodash";
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

    $scope.refreshing = false;

    $scope.tracks = [];

    $scope.continousPlay = true;

    $scope.toggleContinousPlay = () => {
      $scope.continousPlay = !$scope.continousPlay;
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
      var index = findIndex($rootScope.tracks, function (track) {
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

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Fresh reload on loginsatuschange");
      $scope.refresh();
    });

    $rootScope.$on("playlistBeginEvent", (event, data) => {

    });

    $rootScope.$on("playlistEndEvent", (event, data) => {

    });

    if ($rootScope.fresh_albums === undefined || $rootScope.fresh_albums.length === 0) {
      $scope.refresh();
    }
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
