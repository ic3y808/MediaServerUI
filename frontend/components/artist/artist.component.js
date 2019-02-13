import './artist.scss';
import Glide from '@glidejs/glide'


class ArtistController {
  constructor($scope, $rootScope, $routeParams, $compile, Cache, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$compile = $compile;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artist-controller');
    this.AppUtilities.showLoader();
    $scope.artistName = '';
    $scope.artist = {};
    $scope.artist = {};
    $scope.albums = [];
    $scope.artist.tracks = [];
    $scope.all_expanded = false;
    $scope.albums_expanded = true;
    $scope.artist.tracks_expanded = false;
    $('#trackListContainer').hide();


    var that = this;

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.toggleAlbums = function () {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = function () {
      if ($scope.artist.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.artist.tracks_expanded = !$scope.artist.tracks_expanded;
    }

    $scope.toggleAll = function () {
      $scope.artist.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.artist.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.getTags = function (obj) {
      return obj;
    }

    $scope.getArtist = function () {

      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.artist = cache;
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      } else {
        var artist = that.AlloyDbService.getArtist($routeParams.id);
        if (artist) {
          artist.then(function (artist) {

            $scope.artist = artist

            $scope.artist.albums.forEach(function (album) {
              album.cover_art = $scope.getCoverArt(album.cover_art);
            });

            that.AppUtilities.apply();
            that.AppUtilities.hideLoader();

            var artistInfo = that.AlloyDbService.getArtistInfo($scope.artist.name);
            if (artistInfo) {
              artistInfo.then(function (info) {
                if (info.artistInfo) {
                  $scope.artist.artistInfo = info.artistInfo;

                  angular.element(document.getElementById('linkContainer')).append($compile("<div> <p>test</p></div>")($scope));

                  if ($scope.artist.artistInfo.bio) {
                    $scope.artist.artistInfo.bio.summary = $scope.artist.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                  }
                  if ($scope.artist.artistInfo.similar) {
                    $scope.artist.artistInfo.similar.artist = $scope.artist.artistInfo.similar.artist.slice(0, 5);
                  }
                  if ($scope.artist.artistInfo.image) {
                    $scope.artist.artistInfo.image.forEach(function (image) {
                      if (image['@'].size === 'large') {
                        $scope.artist.image = image['#'];
                      }
                      if (image['@'].size === 'extralarge') {
                        $scope.artist.image = image['#'];
                      }
                    });
                  }
                  Cache.put($routeParams.id, artist);
                  that.AppUtilities.apply();
                  that.AppUtilities.hideLoader();
                } else {
                  that.AppUtilities.hideLoader();
                }
              });
            }

          

            that.AppUtilities.apply();
          });
        }
      }


    };

    $scope.refresh = function () {
      that.Backend.debug('refresh artist');
      Cache.put($routeParams.id, null);
      $scope.getArtist();
    };

    $scope.startRadio = function () {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      that.$rootScope.tracks = AppUtilities.shuffle($scope.artist.tracks);
      that.MediaPlayer.loadTrack(0);
    };

    $scope.starArtist = function () {
      that.Backend.info('starring artist: ' + $scope.artist);
      if ($scope.artist.starred === 'true') {
        that.AlloyDbService.unstar({ artist: that.$routeParams.id }).then(function (result) {
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'false'
          that.AppUtilities.apply();
        });
      } else {
        that.AlloyDbService.star({ artist: that.$routeParams.id }).then(function (result) {
          that.Backend.info('starred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'true'
          that.AppUtilities.apply();
        });
      }
    };



    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Artist reload on loginsatuschange');
      $scope.getArtist();
    });

    $scope.getArtist();
  }
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
};