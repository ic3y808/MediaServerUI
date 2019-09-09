import "./artists.scss";
class ArtistsController {
  constructor($scope, $rootScope, $timeout, $location, $anchorScroll, $element, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.$element = $element;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("artists-controller");

    $scope.refresh = function () {
      AlloyDbService.refreshArtists();
    };

    $rootScope.$watch("artists", function (newVal, oldVal) {
      if ($rootScope.artists) {
        AppUtilities.apply();
      }
    });

    $rootScope.$on("GotoNowPlaying", (event, data) => {
      if ($rootScope.currentTrack) {
        $(".scrollable").scrollTo("#" + $rootScope.currentTrack.artist_id);
      }
    });
  }

  $onInit() {
    this.$element.addClass("vbox");
  }
}

export default {
  bindings: {},
  controller: ArtistsController,
  templateUrl: "/template/artists.jade"
};