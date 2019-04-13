import "./albums.scss";
class AlbumsController {
  constructor($scope, $rootScope, $element, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("albums-controller");
    this.AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshAlbums();
    };

    $rootScope.$watch("albums", function (newVal, oldVal) {
      if ($rootScope.albums) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }

  $onInit() {
    this.$element.addClass("vbox")
    this.$element.addClass("scrollable")
  };
}

export default {
  bindings: {},
  controller: AlbumsController,
  templateUrl: "/template/albums.jade"
};