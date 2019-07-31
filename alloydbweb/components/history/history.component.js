
class HistoryController {
  constructor($scope, $rootScope, $element, Logger, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Logger = Logger;
    this.AlloyDbService = AlloyDbService;

    this.Logger.debug("history-controller");

    $scope.refresh = function () {
      AlloyDbService.refreshHistory();
    };

    $scope.playTrack = (song, playlist) => {
      this.Logger.debug("Play Track");
      $rootScope.tracks = playlist;
      var index = _.findIndex($rootScope.tracks, function (track) {
        return track.id === song.id;
      });
      this.MediaPlayer.loadTrack(index);
    };

    $rootScope.$watch("history", function (newVal, oldVal) {
      if ($rootScope.history) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: HistoryController,
  templateUrl: "/template/history.jade"
};