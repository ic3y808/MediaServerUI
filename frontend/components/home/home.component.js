import styles from './home.scss';
class HomeController {
  constructor($scope, $rootScope, $timeout, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
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
      AlloyDbService.refreshFresh();
      AlloyDbService.refreshRandom();
    };

    $rootScope.$watch('fresh_albums', (newVal, oldVal) => {
      if ($rootScope.fresh_albums) {


        $timeout(() => {
          $scope.coverflow = coverflow('player').setup({

            playlist: $rootScope.fresh_albums,
            width: '100%',
            height: '100px',
            coverwidth: 100,
            coverheight: 100,
            //reflectionoffset: -10,
            //fixedsize: true,
          }).on('ready', function () {
            this.on('focus', index => {

            });

            this.on('click', (index, link) => {

            });
          })
          this.AppUtilities.apply();
          this.AppUtilities.hideLoader();
        });
      }
    });

    $rootScope.$watch('random', (newVal, oldVal) => {
      if ($rootScope.random) {
        var randomTrack = $rootScope.random[~~($rootScope.random.length * Math.random())];
        if (randomTrack.cover_art) {
          $scope.artistImage = this.AlloyDbService.getCoverArt({ track_id: randomTrack.cover_art })
        }
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
};