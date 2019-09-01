import "./playing.scss";
class PlayingController {
  constructor($scope, $rootScope, $element, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("playing-controller");


    $scope.getSong = () => {

      $scope.selectedTrack = this.MediaPlayer.selectedTrack();

      if ($scope.selectedTrack) {

        var artist = this.AlloyDbService.getArtist($scope.selectedTrack.artist_id);
        if (artist) {
          artist.then((info) => {
            $scope.artist = info;
          });
        }

        var album = this.AlloyDbService.getAlbum($scope.selectedTrack.album_id);
        if (album) {
          album.then((info) => {
            $scope.album = info;
            $scope.album.image = this.AlloyDbService.getCoverArt({ album_id: album.id });
          });
          
        }

        Promise.all([artist, album], (result) => {
          this.AppUtilities.hideLoader();
          this.AppUtilities.apply();
        });

        $scope.previousTracks = this.MediaPlayer.previousTracks(5);
        $scope.upcomingTracks = this.MediaPlayer.upcomingTracks(5);

        $scope.previousTrack = $scope.previousTracks[0];
        $scope.upcomingTrack = $scope.upcomingTracks[0];


        //if (previous) {
        //  var previousPromise = AlloyDbService.getTrackInfo(previous.id)
        //  if (previousPromise) {
        //    previousPromise.then(function (info) { });
        //  }
        //}
        //if (next) {
        //  var nextPromise = AlloyDbService.getTrackInfo(next.id)
        //  if (nextPromise) {
        //    nextPromise.then(function (info) { });
        //  }
        //}
      } else { this.AppUtilities.hideLoader(); }
    };

    $scope.starTrack = () => {
      if (this.MediaPlayer) {
        var selected = this.MediaPlayer.selectedTrack();
        if (selected) {
          this.Logger.info("Trying to star track: " + selected.title);
          if (selected.starred === "true") {
            this.AlloyDbService.unstar({ id: selected.id }).then((result) => {
              this.Logger.info("UnStarred " + selected.title + " " + JSON.stringify(result));
              selected.starred = "false";
              this.AppUtilities.apply();
            });
          } else {
            this.AlloyDbService.star({ id: selected.id }).then((result) => {
              this.Logger.info("Starred " + selected.title + " " + JSON.stringify(result));
              selected.starred = "true";
              this.AppUtilities.apply();
            });
          }
          $scope.info = this.MediaPlayer.selectedTrack();
        }
      }
    };

    $rootScope.$on("trackChangedEvent", (event, data) => {
      this.Logger.debug("Track Changed reloading now playing");
      $scope.getSong();
    });

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("login changed reloading now playing");
      $scope.getSong();
    });

    $scope.getSong();
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: PlayingController,
  templateUrl: "/template/playing.jade"
};