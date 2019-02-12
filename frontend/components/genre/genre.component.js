import './genre.scss';
class GenreController {
  constructor($scope, $rootScope, $routeParams, Cache, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('genre-controller');
    this.AppUtilities.showLoader();
    $scope.artist = {};
    $scope.albums = [];
    $scope.genre = { tracks: [] }
    $scope.artistName = '';
    $scope.all_expanded = false;
    $scope.albums_expanded = true;
    $scope.genre.tracks_expanded = false;
    $scope.genre = this.$routeParams.id;
    var that = this;

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.getGenre = function () {
      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.genre = cache;
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      } else {
        if (AlloyDbService.isLoggedIn) {
          that.AlloyDbService.getGenre(that.$routeParams.id).then(function (result) {
            $scope.genre = result;

            var randomTrack = $scope.genre.tracks[Math.floor(Math.random() * $scope.genre.tracks.length)];
            if (randomTrack) {
              $scope.genre.image = that.AlloyDbService.getCoverArt(randomTrack.cover_art);
            }

            var genreInfo = that.AlloyDbService.getGenreInfo($scope.genre.name);
            if (genreInfo) {
              genreInfo.then(function (result) {
                $scope.genre.genreinfo = result.genreInfo;
                $scope.genre.genreinfo.wiki.summary = $scope.genre.genreinfo.wiki.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                Cache.put($routeParams.id, $scope.genre);
                that.AppUtilities.apply();
              });
            }
            that.AppUtilities.apply();
            that.AppUtilities.hideLoader();
          });
        }
      }
    };

    $scope.toggleAlbums = function () {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = function () {
      if ($scope.genre.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.genre.tracks_expanded = !$scope.genre.tracks_expanded;
    }

    $scope.toggleAll = function () {
      $scope.genre.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.genre.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.refresh = function () {
      that.Backend.debug('refresh genre');
      Cache.put($routeParams.id, null);
      $scope.getGenre();
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      $rootScope.tracks = AppUtilities.shuffle($scope.genre.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Genre reload on loginsatuschange');
      $scope.refresh();
    });

    $scope.getGenre();
  }
}

export default {
  bindings: {},
  controller: GenreController,
  templateUrl: '/template/genre.jade'
};