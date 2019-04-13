import "./playing.scss";
class PlayingController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("playing-controller");

    $scope.getSong = () => {

      $scope.info = this.MediaPlayer.selectedTrack();
      console.log($scope.info);
      if ($scope.info) {

        var coverArt = this.AlloyDbService.getCoverArt({track_id: $scope.info.id });
        if (coverArt) {
          $scope.info.image = coverArt;
          this.AppUtilities.apply();
        }
        this.AppUtilities.hideLoader();
        this.AppUtilities.apply();


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
      } else this.AppUtilities.hideLoader();
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
}

export default {
  bindings: {},
  controller: PlayingController,
  templateUrl: "/template/playing.jade"
};