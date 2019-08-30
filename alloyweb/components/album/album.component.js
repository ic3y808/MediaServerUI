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
    this.Logger.debug("artist-controller");
    this.AppUtilities.showLoader();


    $scope.getCoverArt = (id) => {
      return this.AlloyDbService.getCoverArt(id);
    };

    //$scope.refreshInfo = (data) => {
    //  if (data) {
    //    data.forEach((info) => {
    //      if (info.albumInfo) {
    //        $scope.album.albumInfo = info.albumInfo;
    //        if ($scope.albumInfo.image) {
    //          $scope.album.artistInfo.image.forEach((image) => {
    //            if (image["@"].size === "large") {
    //              $scope.albumImage = image["#"];
    //            }
    //            if (image["@"].size === "extralarge") {
    //              $scope.albumImage = image["#"];
    //            }
    //          });
    //        }
    //      }
    //    });
    //  }
    //};

    $scope.goToArtist = (id) => {
      window.location.href = "/artist/" + id;
    };

    $scope.refresh = () => {
      this.Logger.debug("refresh album");
      this.AlloyDbService.refreshAlbum($routeParams.id);
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play album " + $scope.info.album.name);
      this.$rootScope.tracks = $scope.info.tracks;
      this.MediaPlayer.loadTrack(~~($scope.info.tracks.length * Math.random()));
    };

    $scope.shareAlbum = () => {
      this.Logger.debug("shareButton");
      this.AlloyDbService.createShare(
        $scope.album.id,
        "Shared from Alloy"
      ).then((result) => {
        $("#shareAlbumButton")
          .popover({
            animation: true,
            content: "Success! Url Copied to Clipboard.",
            delay: {
              show: 0,
              hide: 5000
            },
            placement: "top"
          })
          .popover("show");
        var url = result.url.toString();
        this.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $("#shareAlbumButton").popover("hide");
        }, 5000);
      });
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
      $rootScope.tracks = $scope.info.tracks;
      var index = findIndex($rootScope.tracks, function (track) {
        return track.id === song.id;
      });
      this.MediaPlayer.loadTrack(index);
    };

    $scope.playAlbum = () => {
      this.Logger.debug("Play Album");
      $rootScope.tracks = $scope.info.tracks;
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