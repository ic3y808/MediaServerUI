import './home.scss';
class HomeController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('home-controller');
    var that = this;

    $scope.refresh = function () {

      $scope.random = [];
      var getRandomSongs = that.AlloyDbService.getRandomSongs();
      if (getRandomSongs) {
        getRandomSongs.then(function (result) {
          $scope.random = result;
          that.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Home reload on loginsatuschange');
      $scope.refresh();
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {


    });

    $rootScope.$on('windowResized', function (event, data) {


    });


    $scope.refresh();

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');

    this.AppUtilities.hideLoader();

  }
}

export default {
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
};