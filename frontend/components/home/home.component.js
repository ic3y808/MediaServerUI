import styles from './home.scss';
class HomeController {
  constructor($scope, $rootScope, $timeout, $element, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$element = $element;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('home-controller');

    $scope.refreshing = false;
    AppUtilities.showLoader();

    $scope.refresh = () => {
      AlloyDbService.refreshCharts();

    };

    $rootScope.$watch("charts", (newVal, oldVal) => {
      if ($rootScope.charts) {
        if ($rootScope.charts.top_tracks) {
          $scope.top_tracks = AppUtilities.getRandom($rootScope.charts.top_tracks, 10);
          $scope.never_played = AppUtilities.getRandom($rootScope.charts.never_played, 10);
          $scope.never_played_albums = AppUtilities.getRandom($rootScope.charts.never_played_albums, 10);
          this.AppUtilities.apply();
        }
      }
    });
  }
  $onInit() {
    this.$element.addClass('vbox')
    this.$element.addClass('scrollable')
  };
}

export default {
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
};