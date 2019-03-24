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

    $scope.random = () => {
      return 0.5 - Math.random();
    }

    $scope.playTrack = (song, playlist) => {
      this.Logger.debug("Play Track");
      $rootScope.tracks = playlist;
      var index = _.findIndex($rootScope.tracks, function (track) {
        return track.id === song.id;
      });
      this.MediaPlayer.loadTrack(index);
    };

    $scope.playAlbum = (album) => {
      this.Logger.debug("Play Album");
      this.AlloyDbService.getAlbum(album.id).then(result => {
        $rootScope.tracks = result.tracks;
        this.MediaPlayer.loadTrack(0);
      });
    };

    $scope.playArtist = (artist) => {
      this.Logger.debug("Play Album");
      $rootScope.tracks = AppUtilities.shuffle(artist.tracks);
      this.MediaPlayer.loadTrack(0);
    };
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