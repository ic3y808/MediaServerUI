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
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshArtists();
    };

    $scope.jumpBarClick = function () {

    };

    $rootScope.$watch("artists", function (newVal, oldVal) {
      if ($rootScope.artists) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });

    if ($rootScope.artists === undefined || $rootScope.artists.length === 0) {
      $scope.refresh();
    }
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: ArtistsController,
  templateUrl: "/template/artists.jade"
};