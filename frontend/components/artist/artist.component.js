import './artist.scss';
import Glide from '@glidejs/glide'


class ArtistController {
  constructor($scope, $rootScope, $routeParams, $compile, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$compile = $compile;
    this.Cache = Cache;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('artist-controller');
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



    $scope.getCoverArt = params => {
      return this.AlloyDbService.getCoverArt(params);
    }

    $scope.toggleAlbums = () => {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = () => {
      if ($scope.artist.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.artist.tracks_expanded = !$scope.artist.tracks_expanded;
    }

    $scope.toggleAll = () => {
      $scope.artist.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.artist.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.getTags = obj => {
      return obj;
    }

    $scope.getArtist = () => {

      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.info = cache;
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      } else {
        var artist = this.AlloyDbService.getArtist($routeParams.id);
        if (artist) {
          artist.then(info => {

            $scope.info = info;
            var coverArt = this.AlloyDbService.getCoverArt({
              artist_id: $routeParams.id
            });


            if (coverArt) {
              $scope.info.artist.image = coverArt;
              this.AppUtilities.apply();
            }



            this.AppUtilities.apply();
            this.AppUtilities.hideLoader();

            //var artistInfo = this.AlloyDbService.getArtistInfo($scope.artist.name);
            //if (artistInfo) {
            //  artistInfo.then(function (info) {
            //    if (info.artistInfo) {
            //      $scope.artist.artistInfo = info.artistInfo;
            //
            //      angular.element(document.getElementById('linkContainer')).append($compile("<div> <p>test</p></div>")($scope));
            //
            //      if ($scope.artist.artistInfo.bio) {
            //        $scope.artist.artistInfo.bio.summary = $scope.artist.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            //      }
            //      if ($scope.artist.artistInfo.similar) {
            //        $scope.artist.artistInfo.similar.artist = $scope.artist.artistInfo.similar.artist.slice(0, 5);
            //      }
            //      if ($scope.artist.artistInfo.image) {
            //        $scope.artist.artistInfo.image.forEach(function (image) {
            //          if (image['@'].size === 'large') {
            //            $scope.artist.image = image['#'];
            //          }
            //          if (image['@'].size === 'extralarge') {
            //            $scope.artist.image = image['#'];
            //          }
            //        });
            //      }
            //      Cache.put($routeParams.id, artist);
            //      this.AppUtilities.apply();
            //      this.AppUtilities.hideLoader();
            //    } else {
            //      this.AppUtilities.hideLoader();
            //    }
            //  });
            //}
            //
            //

          });
        }
      }


    };

    $scope.refresh = () => {
      this.Logger.debug('refresh artist');
      Cache.put($routeParams.id, null);
      $scope.getArtist();
    };

    $scope.startRadio = () => {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(similarSongs => {
        this.Logger.debug('starting radio');
        $rootScope.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = () => {
      this.Logger.debug('shuffle play');
      this.$rootScope.tracks = AppUtilities.shuffle($scope.info.tracks);
      this.MediaPlayer.loadTrack(0);
    };

    $scope.starArtist = () => {
      this.Logger.info('Trying to star artist: ' + $scope.info.name);
      if ($scope.artist.starred === 'true') {
        this.AlloyDbService.unstar({
          artist: this.$routeParams.id
        }).then(result => {
          this.Logger.info('UnStarred ' + $scope.info.name + ' ' + JSON.stringify(result));
          this.$scope.info.starred = 'false'
          this.AppUtilities.apply();
        });
      } else {
        this.AlloyDbService.star({
          artist: this.$routeParams.id
        }).then(result => {
          this.Logger.info('Starred ' + $scope.info.name + ' ' + JSON.stringify(result));
          this.$scope.info.starred = 'true'
          this.AppUtilities.apply();
        });
      }
    };



    $rootScope.$on('loginStatusChange', (event, data) => {
      this.Logger.debug('Artist reload on loginsatuschange');
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