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
      $rootScope.tracks = album.tracks;
      this.MediaPlayer.loadTrack(0);
    };

    $scope.playArtist = (artist) => {
      this.Logger.debug("Play Album");
      $rootScope.tracks = AppUtilities.shuffle(artist.tracks);
      this.MediaPlayer.loadTrack(0);
    };

    $rootScope.$watch("charts", (newVal, oldVal) => {
      if ($rootScope.charts) {
        if ($rootScope.charts.top_tracks) {
          $scope.top_tracks = AppUtilities.getRandom($rootScope.charts.top_tracks, 10);
          $scope.never_played = AppUtilities.getRandom($rootScope.charts.never_played, 10);
          $scope.never_played_albums = AppUtilities.getRandom($rootScope.charts.never_played_albums, 12);
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