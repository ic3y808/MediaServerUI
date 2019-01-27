class IndexController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('index-controller');
    this.AppUtilities.showLoader();
    $scope.artists = [];
    var that = this;

    $scope.refresh = function () {
      AlloyDbService.refreshIndex();
    };

    $scope.reloadArtists = function () {
      $scope.artists = [];
      var getMusicFoldersIndex = that.AlloyDbService.getMusicFoldersIndex();
      if (getMusicFoldersIndex) {
        getMusicFoldersIndex.then(function (result) {
          $scope.artists = result;
          that.AppUtilities.apply();
          that.AppUtilities.hideLoader();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Index reload on loginsatuschange');

    });

    $rootScope.$watch('music_index', function (newVal, oldVal) {
      if ($rootScope.music_index) {
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: IndexController,
  templateUrl: '/template/index-view.jade'
};