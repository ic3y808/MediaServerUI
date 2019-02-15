import "./album.scss";
class AlbumController {
  constructor($scope, $rootScope, $routeParams, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Cache = Cache;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("artist-controller");
    this.AppUtilities.showLoader();
    $scope.album = {};
    $scope.album.tracks = [];
    $scope.albumName = "";
    $scope.artistName = "";
    var that = this;

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    };

    $scope.getArtistInfo = function (data) {
      if (data) {
        data.forEach(function (info) {
          if (info.artistInfo) {
            $scope.album.artistInfo = info.artistInfo;
            if ($scope.album.artistInfo.bio) {
              $scope.artistBio = $scope.album.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            }
            if ($scope.album.artistInfo.similar) {
              $scope.similarArtists = $scope.album.artistInfo.similar.artist.slice(0, 5);
            }
            if ($scope.album.artistInfo.image) {
              $scope.album.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'large') {
                  $scope.artistImage = image['#'];
                }
                if (image['@'].size === 'extralarge') {
                  $scope.artistImage = image['#'];
                }
              });
            }
          }
        });
      }
    };

    $scope.getAlbumInfo = function (data) {
      if (data) {
        data.forEach(function (info) {
          if (info.albumInfo) {
            $scope.album.albumInfo = info.albumInfo;
            if ($scope.albumInfo.image) {
              $scope.album.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'large') {
                  $scope.albumImage = image['#'];
                }
                if (image['@'].size === 'extralarge') {
                  $scope.albumImage = image['#'];
                }
              });
            }
          }
        });
      }
    };

    $scope.getAlbum = function () {

      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.album = cache;
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      } else {
        var alb = AlloyDbService.getAlbum($routeParams.id);
        if (alb) {
          alb.then(function (album) {
            if (album) {
              $scope.album = album;
              $scope.album.albumArt = $scope.getCoverArt($scope.album.tracks[0].cover_art);
              $scope.album.artist = { name: $scope.album.base_path };

              var artistInfo = that.AlloyDbService.getArtistInfo($scope.artistName);
              var albumInfo = that.AlloyDbService.getAlbumInfo($scope.artistName, $scope.albumName);

              Promise.all([artistInfo, albumInfo]).then(function (info) {
                $scope.getArtistInfo(info);
                $scope.getAlbumInfo(info);

                if ($scope.album.tracks && $scope.album.tracks.length > 0) {
                  if ($routeParams.trackid) {
                    $scope.album.tracks.forEach(function (track) {
                      if (track.id === $routeParams.trackid) {
                        track.selected = true;
                      }
                    });
                  }
                }

                Cache.put($routeParams.id, $scope.album);
                that.AppUtilities.apply();
                that.AppUtilities.hideLoader();
              });
            } else {
              that.AppUtilities.hideLoader();
            }
          });
        }
      }
    };

    $scope.goToArtist = function (id) {
      window.location.href = "/artist/" + id;
    };

    $scope.refresh = function () {
      that.Logger.debug("refresh album");
      Cache.put($routeParams.id, null);
      $scope.getAlbum();
    };

    $scope.startRadio = function () {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (
        similarSongs
      ) {
        that.Logger.debug("starting radio");
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = function () {
      that.Logger.debug("shuffle play");
      that.$rootScope.tracks = AppUtilities.shuffle($scope.album.tracks);
      that.MediaPlayer.loadTrack(0);
    };

    $scope.shareAlbum = function () {
      that.Logger.debug("shareButton");
      that.AlloyDbService.createShare(
        $scope.album.id,
        "Shared from Alloy"
      ).then(function (result) {
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
        that.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $("#shareAlbumButton").popover("hide");
        }, 5000);
      });
    };

    $scope.starAlbum = function () {
      that.Logger.info("liking album: " + that.$scope.album.name);
      if ($scope.album.starred === "true") {
        that.AlloyDbService.unstar({ album: that.$scope.album.id }).then(
          function (result) {
            that.Logger.info("UnStarred");
            that.Logger.info(result);
            that.$scope.album.starred = "false";
            that.AppUtilities.apply();
          }
        );
      } else {
        that.AlloyDbService.star({ album: that.$scope.album.id }).then(function (
          result
        ) {
          that.Logger.info("starred");
          that.Logger.info(result);
          that.$scope.album.starred = "true";
          that.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on("loginStatusChange", function (event, data) {
      that.Logger.debug("Album reload on loginsatuschange");
      $scope.refresh();
    });

    $scope.getAlbum();
  }
}

export default {
  bindings: {},
  controller: AlbumController,
  templateUrl: "/template/album.jade"
};
