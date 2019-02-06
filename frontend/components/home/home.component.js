import styles from './home.scss';
class HomeController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('home-controller');
    var that = this;
    $scope.refreshing = false;
    AppUtilities.showLoader();

    $scope.refresh = function () {
      AlloyDbService.refreshFresh();
      AlloyDbService.refreshRandom();
    };

    $rootScope.$watch('fresh_albums', function (newVal, oldVal) {
      if ($rootScope.fresh_albums) {
       

        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({

            playlist: $rootScope.fresh_albums,
            width: '100%',
            height: '100px',
            coverwidth: 100,
            coverheight: 100,
            //reflectionoffset: -10,
            //fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {

            });

            this.on('click', function (index, link) {

            });
          });
          that.AppUtilities.apply();
          that.AppUtilities.hideLoader();
        });
      }
    });

    $rootScope.$watch('random', function (newVal, oldVal) {
      if ($rootScope.random) {
        var randomTrack = $rootScope.random[Math.floor(Math.random()*$rootScope.random.length)];
        $scope.artistImage = that.AlloyDbService.getCoverArt(randomTrack.cover_art)
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
};