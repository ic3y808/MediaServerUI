import "./genre.scss";
class GenreController {
  constructor($scope, $rootScope, $routeParams, $element, Cache, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$element = $element;
    this.Cache = Cache;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("genre-controller");
    this.AppUtilities.showLoader();
    $scope.genre = this.$routeParams.id;

    $scope.getGenre = () => {
      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.genre = cache;
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      } else {
        if (AlloyDbService.isLoggedIn) {
          this.AlloyDbService.getGenre(this.$routeParams.id).then((result) => {
            $scope.info = result;
            $scope.info.tracks.forEach((track) => {
              track.image = this.AlloyDbService.getCoverArt({ track_id: track.id });
            });
            $scope.info.never_played.forEach((track) => {
              track.image = this.AlloyDbService.getCoverArt({ track_id: track.id });
            });
            $scope.info.artists.forEach((artist) => {
              artist.image = this.AlloyDbService.getCoverArt({ artist_id: artist.id });
            });
            $scope.info.albums.forEach((album) => {
              album.image = this.AlloyDbService.getCoverArt({ album_id: album.id });
            });
            var randomTrack = $scope.info.tracks[Math.floor(Math.random() * $scope.info.tracks.length)];
            if (randomTrack) {
              $scope.info.image = this.AlloyDbService.getCoverArt({ track_id: randomTrack.id });
            }
            this.AppUtilities.apply();
            this.AppUtilities.hideLoader();
          });
        }
      }
    };

    $scope.refresh = () => {
      this.Logger.debug("refresh genre");
      Cache.put($routeParams.id, null);
      $scope.getGenre();
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play");
      $rootScope.tracks = AppUtilities.shuffle($scope.info.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Genre reload on loginsatuschange");
      $scope.refresh();
    });

    $scope.getGenre();
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: GenreController,
  templateUrl: "/template/genre.jade"
};