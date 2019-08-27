class ShareController {
  constructor($scope, $rootScope, $routeParams, $timeout, $element, AlloyDbService, AppUtilities, Backend, Cache, Logger, MediaElement, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$timeout = $timeout;
    this.$element = $element;
    this.AlloyDbService = AlloyDbService;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Cache = Cache;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.Logger.debug("share-controller");

    $scope.getShare = () => {
      var cache = Cache.get($routeParams.id);

      if (cache) {
        $scope.info = cache;
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      } else {
        var share = this.AlloyDbService.getShare($routeParams.id);
        if (share) {
          share.then((info) => {

            $scope.info = info;
            switch ($scope.info.share.type) {
              case "track":
                $scope.info.image = this.AlloyDbService.getCoverArt({ track_id: $scope.info.track.id });
                $scope.info.tracks = [$scope.info.track];
                break;
              case "album":
                $scope.info.image = this.AlloyDbService.getCoverArt({ album_id: $scope.info.album.id });
                break;
              case "artist":
                $scope.info.image = this.AlloyDbService.getCoverArt({ artist_id: $scope.info.artist.id });
                $scope.info.tracks.forEach((track) => {
                  track.image = this.AlloyDbService.getCoverArt({ track_id: track.id });
                });
                break;
              case "genre":
                $scope.info.image = this.AlloyDbService.getCoverArt({ genre_id: $scope.info.genre.id });
                break;
            }
            Cache.put($routeParams.id, $scope.info);
            this.AppUtilities.apply();
            this.AppUtilities.hideLoader();
          });
        }
      }
    };

    $scope.refresh = () => {
      this.Logger.debug("refresh share");
      Cache.put($routeParams.id, null);
      $scope.getShare();
    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Artist reload on loginsatuschange");
      $scope.getShare();
    });

    $scope.getShare();
  }


  $onInit() {
    this.$element.addClass("vbox");
  }
}

export default {
  bindings: {},
  controller: ShareController,
  templateUrl: "/template/share.jade"
};
