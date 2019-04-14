import "./album.scss";
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


<<<<<<< HEAD
    $scope.getCoverArt = (id) => {
      return this.AlloyDbService.getCoverArt(id);
    };
=======
    $scope.getCoverArt = (id) => this.AlloyDbService.getCoverArt(id);
>>>>>>> master

    //$scope.getArtistInfo = data => {
    //  if (data) {
    //    data.forEach(info => {
    //      if (info.artistInfo) {
    //        $scope.album.artistInfo = info.artistInfo;
    //        if ($scope.album.artistInfo.bio) {
    //          $scope.artistBio = $scope.album.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
    //        }
    //        if ($scope.album.artistInfo.similar) {
    //          $scope.similarArtists = $scope.album.artistInfo.similar.artist.slice(0, 5);
    //        }
    //        if ($scope.album.artistInfo.image) {
    //          $scope.album.artistInfo.image.forEach(image => {
    //            if (image["@"].size === "large") {
    //              $scope.artistImage = image["#"];
    //            }
    //            if (image["@"].size === "extralarge") {
    //              $scope.artistImage = image["#"];
    //            }
    //          });
    //        }
    //      }
    //    });
    //  }
    //};

    $scope.getAlbumInfo = (data) => {
      if (data) {
        data.forEach((info) => {
          if (info.albumInfo) {
            $scope.album.albumInfo = info.albumInfo;
            if ($scope.albumInfo.image) {
              $scope.album.artistInfo.image.forEach((image) => {
                if (image["@"].size === "large") {
                  $scope.albumImage = image["#"];
                }
                if (image["@"].size === "extralarge") {
                  $scope.albumImage = image["#"];
                }
              });
            }
          }
        });
      }
    };

    $scope.getAlbum = () => {


      var alb = AlloyDbService.getAlbum($routeParams.id);
      if (alb) {
        alb.then((info) => {
          if (info) {
            $scope.info = info;

            var coverArt = this.AlloyDbService.getCoverArt({
              album_id: $routeParams.id
            });


            if (coverArt) {
              $scope.info.album.image = coverArt;
              this.AppUtilities.apply();
            }

            if ($scope.info.tracks && $scope.info.tracks.length > 0) {
              if ($routeParams.trackid) {
                $scope.info.tracks.forEach(function (track) {
                  if (track.id === $routeParams.trackid) {
                    track.selected = true;
                    AppUtilities.apply();
                  }
                });
              }
            }


            this.AppUtilities.apply();

            this.AppUtilities.hideLoader();
          }
        });
      }

    };

    $scope.goToArtist = (id) => {
      window.location.href = "/artist/" + id;
    };

    $scope.refresh = () => {
      this.Logger.debug("refresh album");
      Cache.put($routeParams.id, null);
      $scope.getAlbum();
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
      var index = _.findIndex($rootScope.tracks, function (track) {
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

    $scope.getAlbum();
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