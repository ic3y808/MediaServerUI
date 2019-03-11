import './starred.scss';
class StarredController {
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
    this.Logger.debug('starred-controller');
    this.AppUtilities.showLoader();

    $scope.toggleContinousPlay = () => {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = id => {
      return this.AlloyDbService.getCoverArt(id);
    }

    $scope.findNowPlaying = id => {
      $rootScope.fresh_albums.forEach(album => {

      });
    }

    $scope.playSong = (song) =>{
      Logger.debug('selection changed');
      $rootScope.tracks = $rootScope.starred_tracks;
      var index = _.findIndex($rootScope.tracks, function (track) {
        return track.id === song.id;
      });
      MediaPlayer.loadTrack(index);
    };

    $scope.playAlbum = (album) =>{
      Logger.debug('selection changed');
      $rootScope.tracks = album.tracks;
      MediaPlayer.loadTrack(0);
    };

    $scope.refresh = () => {
      AlloyDbService.refreshStarred();
    };

    $scope.shuffle = () => {
      this.Logger.debug('shuffle play');
      $rootScope.tracks = AppUtilities.shuffle($rootScope.starred_tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$watch('starred_tracks', (newVal, oldVal) =>  {
      if ($rootScope.starred_tracks) {

        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      }
    });

    $rootScope.$watch('starred_albums', (newVal, oldVal) =>  {
      if ($rootScope.starred_albums) {

        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
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
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};