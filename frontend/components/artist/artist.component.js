import './artist.scss';
import Glide from '@glidejs/glide'


class ArtistController {
  constructor($scope, $rootScope, $routeParams, $compile, $element, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$compile = $compile;
    this.$element = $element;
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
    $scope.tracks_expanded = false;
    $('#trackListContainer').hide();

    $scope.toggleAlbums = () => {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = () => {
      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.tracks_expanded = !$scope.tracks_expanded;
    }

    $scope.expandAll = () => {
      $scope.tracks_expanded = true;
      $scope.albums_expanded = true;
      $('#albumListContainer').show();
      $('#trackListContainer').show();
      this.AppUtilities.apply();
    }

    $scope.collapseAll = () => {
      $scope.tracks_expanded = false;
      $scope.albums_expanded = false;
      $('#albumListContainer').hide();
      $('#trackListContainer').hide();
      this.AppUtilities.apply();
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

            Cache.put($routeParams.id, $scope.info);
            this.AppUtilities.apply();
            this.AppUtilities.hideLoader();
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
      this.Logger.debug('shuffle play artist ' + $scope.info.artist.name);
      this.$rootScope.tracks = $scope.info.tracks
      this.MediaPlayer.loadTrack(~~($scope.info.tracks.length * Math.random()));
    };

    $scope.getLinkIcon = function (link) {
      var base = 'icon-';
      switch (link.type) {
        case "discogs": { return base + link.type; }
        case "wikipedia": { return base + link.type; }
        case "myspace": { return base + link.type; }
        case "last": { return base + link.type; }
        case "wikidata": { return base + link.type; }
        case "allmusic": { return base + link.type; }
        case "facebook": { return base + link.type; }
        case "twitter": { return base + link.type; }
        case "beatport": { return base + link.type; }
        case "youtube": { return base + link.type; }
        case "bbc": { return base + link.type; }

        case "soundcloud": { return base + link.type; }
        case "bandcamp": { return base + link.type; }
        default: { return base + "external-link" }
      }
    }

    $scope.starArtist = () => {
      this.Logger.info('Trying to star artist: ' + $scope.info.artist.name);
      if ($scope.info.artist.starred === 'true') {
        this.AlloyDbService.unstar({
          artist: this.$routeParams.id
        }).then(result => {
          this.Logger.info('UnStarred ' + $scope.info.artist.name + ' ' + JSON.stringify(result));
          this.$scope.info.artist.starred = 'false'
          this.AppUtilities.apply();
        });
      } else {
        this.AlloyDbService.star({
          artist: this.$routeParams.id
        }).then(result => {
          this.Logger.info('Starred ' + $scope.info.artist.name + ' ' + JSON.stringify(result));
          this.$scope.info.artist.starred = 'true'
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

  $onInit() {
    this.$element.addClass('vbox')
    this.$element.addClass('scrollable')
  };
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
};