import "./album.scss";
import { findIndex } from "lodash";
class AlbumController {
  constructor($scope, $rootScope, $routeParams, $element, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Cache = Cache;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("album-controller");
    this.AppUtilities.showLoader();

    $scope.refresh = () => {
      if ($rootScope.album && $rootScope.album.album && $routeParams.id === $rootScope.album.album.id) { return; }
      this.Logger.debug("refresh album");
      this.AlloyDbService.refreshAlbum($routeParams.id);
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play album " + $rootScope.album.album.name);
      this.$rootScope.tracks = $rootScope.album.tracks;
      this.MediaPlayer.loadTrack(~~($rootScope.album.tracks.length * Math.random()));
    };

    $scope.isDisabled = () => {
      if ($rootScope.album.tracks) { return false; }
      else { return true; }
    };

    $scope.starAlbum = () => {
      this.Logger.info("liking album: " + this.$scope.album.name);
      if ($scope.album.starred === "true") {
        this.AlloyDbService.unstar({
          album: this.$scope.album.id
        }).then((result) => {
          this.Logger.info("UnStarred");
          this.Logger.info(result);
          this.$scope.album.starred = "false";
          this.AppUtilities.apply();
        });
      } else {
        this.AlloyDbService.star({
          album: this.$scope.album.id
        }).then((result) => {
          this.Logger.info("starred");
          this.Logger.info(result);
          this.$scope.album.starred = "true";
          this.AppUtilities.apply();
        });
      }
    };

    $scope.playTrack = (song) => {
      this.Logger.debug("Play Track");
      $rootScope.tracks = $rootScope.album.tracks;
      var index = findIndex($rootScope.tracks, function (track) {
        return track.id === song.id;
      });
      this.MediaPlayer.loadTrack(index);
    };

    $scope.playAlbum = () => {
      this.Logger.debug("Play Album");
      $rootScope.tracks = $rootScope.album.tracks;
      this.MediaPlayer.loadTrack(0);
    };


    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Album reload on loginsatuschange");
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
  controller: AlbumController,
  templateUrl: "/template/album.jade"
};