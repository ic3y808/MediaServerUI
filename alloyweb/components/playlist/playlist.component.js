import "./playlist.scss";
class PlaylistController {
  constructor($scope, $rootScope, $element, $routeParams, Logger, MediaElement, MediaPlayer, AppUtilities, AlloyDbService, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.$routeParams = $routeParams;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    this.Backend = Backend;
    this.Logger.debug("playlist-controller");

    $scope.refresh = () => {
      var playlist = this.AlloyDbService.getPlaylist($routeParams.id);
      if (playlist) {
        playlist.then((info) => {
          if (info) {
            $scope.info = info.playlist;
            $scope.info.cache = $scope.info.cache === "true";

            var randomTrack = $scope.info.tracks[0];
            if (randomTrack) {
              $scope.info.image = this.AlloyDbService.getCoverArt({ track_id: randomTrack.id });
            }

            this.AppUtilities.apply();
            this.AppUtilities.hideLoader();
            $(".sortable").sortable({ items: "li" });


            $(".sortable").on("sortupdate", function (event, ui) {

              var ids = [];
              $(".list-group-item-track").each(function (item) {
                var opts = $(this).attr("data-value").split(";");
                var method = opts[0];
                var id = opts[1];
                ids.push(id);
              });

              AlloyDbService.updatePlaylist({ id: $scope.info.id, songIds: ids, replace: true }).then((result) => {

                $scope.refresh();
              });

            });

          }
        });
      }

    };

    $scope.removePlaylist = () => {
      this.AlloyDbService.removePlaylist({ id: $routeParams.id }).then(() => {
        this.AlloyDbService.refreshPlaylists();
      });
    };

    $scope.shuffle = () => {
      this.Logger.debug("shuffle play playlist " + $scope.info.name);
      this.$rootScope.tracks = $scope.info.tracks;
      this.MediaPlayer.loadTrack(~~($scope.info.tracks.length * Math.random()));
    };

    $scope.cachePlaylistChanged = () => {
      if ($scope.info) {
        if ($scope.info.cache === undefined || $scope.info.cache === null || $scope.info.cache === "false") {
          $scope.info.cache = "true";
        } else if ($scope.info.cache === "true") {
          $scope.info.cache = "false";
        }
        AlloyDbService.updatePlaylist({ id: $scope.info.id, cache: $scope.info.cache }).then((result) => {
          $scope.refresh();
        });
      }

    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Playlist reload on loginsatuschange");
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
  controller: PlaylistController,
  templateUrl: "/template/playlist.jade"
};