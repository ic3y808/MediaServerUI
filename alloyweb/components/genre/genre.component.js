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
    $scope.genre = this.$routeParams.id;

    $scope.refresh = () => {
      this.Logger.debug("refresh genre");
      this.AlloyDbService.refreshGenre(this.$routeParams.id);
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play");
      $rootScope.tracks = AppUtilities.shuffle($rootScope.genre.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Genre reload on loginsatuschange");
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
  controller: GenreController,
  templateUrl: "/template/genre.jade"
};