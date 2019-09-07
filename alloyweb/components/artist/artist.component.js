import "./artist.scss";
import { findIndex } from "lodash";

class ArtistController {
  constructor($scope, $rootScope, $routeParams, $location, $compile, $element, $window, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.$compile = $compile;
    this.$element = $element;
    this.$window = $window;
    this.Cache = Cache;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("artist-controller");

    $scope.refresh = () => {
      if ($rootScope.artist && $rootScope.artist.artist && $routeParams.id === $rootScope.artist.artist.id) { return; }
      this.Logger.debug("refresh artist");
      AlloyDbService.refreshArtist($routeParams.id);
    };

    $scope.startRadio = () => {
      AlloyDbService.getSimilarSongs2($routeParams.id).then((similarSongs) => {
        this.Logger.debug("starting radio");
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play artist " + this.$rootScope.artist.artist.name);
      this.$rootScope.tracks = this.$rootScope.artist.tracks;
      this.MediaPlayer.loadTrack(~~(this.$rootScope.artist.tracks.length * Math.random()));
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

    $scope.isDisabled = () => {
      if ($rootScope.artist.albums || $rootScope.artist.EPs || $rootScope.artist.singles) { return false; }
      else { return true; }
    };

    $scope.navToSimilar = (similar) => {
      if (similar.id) { this.$location.path("/artist/" + similar.id); }
      else if (similar.url) { this.$window.open(similar.url); }
    };


    $scope.starArtist = () => {
      this.Logger.info("Trying to star artist: " + this.$rootScope.artist.artist.name);
      if (this.$rootScope.artist.artist.starred === "true") {
        this.AlloyDbService.unstar({
          artist: this.$routeParams.id
        }).then((result) => {
          this.Logger.info("UnStarred " + this.$rootScope.artist.artist.name + " " + JSON.stringify(result));
          this.this.$rootScope.artist.artist.starred = "false";
          this.AppUtilities.apply();
        });
      } else {
        this.AlloyDbService.star({
          artist: this.$routeParams.id
        }).then((result) => {
          this.Logger.info("Starred " + this.$rootScope.artist.artist.name + " " + JSON.stringify(result));
          this.this.$rootScope.artist.artist.starred = "true";
          this.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Artist reload on loginsatuschange");
      $scope.refresh();
    });

    $scope.refresh();
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: "/template/artist.jade"
};