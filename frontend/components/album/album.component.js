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


    $scope.getCoverArt = id => {
      return this.AlloyDbService.getCoverArt(id);
    };

    $scope.getArtistInfo = data => {
      if (data) {
        data.forEach(info => {
          if (info.artistInfo) {
            $scope.album.artistInfo = info.artistInfo;
            if ($scope.album.artistInfo.bio) {
              $scope.artistBio = $scope.album.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            }
            if ($scope.album.artistInfo.similar) {
              $scope.similarArtists = $scope.album.artistInfo.similar.artist.slice(0, 5);
            }
            if ($scope.album.artistInfo.image) {
              $scope.album.artistInfo.image.forEach(image => {
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

    $scope.getAlbumInfo = data => {
      if (data) {
        data.forEach(info => {
          if (info.albumInfo) {
            $scope.album.albumInfo = info.albumInfo;
            if ($scope.albumInfo.image) {
              $scope.album.artistInfo.image.forEach(image => {
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

    $scope.getAlbum = () => {

      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.album = cache;
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      } else {
        var alb = AlloyDbService.getAlbum($routeParams.id);
        if (alb) {
          alb.then(album => {
            if (album) {
              $scope.album = album;
              if ($scope.album.tracks && $scope.album.tracks.length > 0)
                $scope.album.albumArt = $scope.getCoverArt($scope.album.tracks[0].cover_art);
              $scope.album.artist = {
                name: $scope.album.artist
              };

              var artistInfo = this.AlloyDbService.getArtistInfo($scope.artistName);
              var albumInfo = this.AlloyDbService.getAlbumInfo($scope.artistName, $scope.albumName);

              Promise.all([artistInfo, albumInfo]).then(info => {
                $scope.getArtistInfo(info);
                $scope.getAlbumInfo(info);

                if ($scope.album.tracks && $scope.album.tracks.length > 0) {
                  if ($routeParams.trackid) {
                    $scope.album.tracks.forEach(track => {
                      if (track.id === $routeParams.trackid) {
                        track.selected = true;
                      }
                    });
                  }
                }

                Cache.put($routeParams.id, $scope.album);
                this.AppUtilities.apply();
                this.AppUtilities.hideLoader();
              });
            } else {
              this.AppUtilities.hideLoader();
            }
          });
        }
      }
    };

    $scope.goToArtist = id => {
      window.location.href = "/artist/" + id;
    };

    $scope.refresh = () => {
      this.Logger.debug("refresh album");
      Cache.put($routeParams.id, null);
      $scope.getAlbum();
    };

    $scope.startRadio = () => {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (
        similarSongs
      ) {
        this.Logger.debug("starting radio");
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play");
      this.$rootScope.tracks = AppUtilities.shuffle($scope.album.tracks);
      this.MediaPlayer.loadTrack(0);
    };

    $scope.shareAlbum = () => {
      this.Logger.debug("shareButton");
      this.AlloyDbService.createShare(
        $scope.album.id,
        "Shared from Alloy"
      ).then(result => {
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
        }).then(result => {
            this.Logger.info("UnStarred");
            this.Logger.info(result);
            this.$scope.album.starred = "false";
            this.AppUtilities.apply();
          }
        );
      } else {
        this.AlloyDbService.star({
          album: this.$scope.album.id
        }).then(result => {
          this.Logger.info("starred");
          this.Logger.info(result);
          this.$scope.album.starred = "true";
          this.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Album reload on loginsatuschange");
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