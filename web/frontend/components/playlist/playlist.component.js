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
          playlist.then(info => {
            if (info) {
              $scope.info = info.playlist;
              
              var randomTrack = $scope.info.tracks[Math.floor(Math.random() * $scope.info.tracks.length)];
              if (randomTrack) {
                $scope.info.image = this.AlloyDbService.getCoverArt({ track_id: randomTrack.id });
              }
             
              this.AppUtilities.apply();

              this.AppUtilities.hideLoader();
            }
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
    this.$element.addClass("vbox")
    this.$element.addClass("scrollable")
  };
}

export default {
  bindings: {},
  controller: PlaylistController,
  templateUrl: "/template/playlist.jade"
};