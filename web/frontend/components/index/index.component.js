class IndexController {
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
    this.Logger.debug("index-controller");
    this.AppUtilities.showLoader();
    $scope.artists = [];

    $scope.refresh = () => {
      AlloyDbService.refreshIndex();
    };

    $scope.reloadArtists = () => {
      $scope.artists = [];
      var getArtistsIndex = this.AlloyDbService.getArtistsIndex();
      if (getArtistsIndex) {
        getArtistsIndex.then(result => {
          $scope.artists = result;
          this.AppUtilities.apply();
          this.AppUtilities.hideLoader();
        });
      }
    };

    $rootScope.$on("loginStatusChange", (event, data) =>  {
      this.Logger.debug("Index reload on loginsatuschange");

    });

    $rootScope.$watch("music_index",  (newVal, oldVal) => {
      if ($rootScope.music_index) {
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: IndexController,
  templateUrl: "/template/index-view.jade"
};