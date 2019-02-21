import './starred.scss';
class StarredController {
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

    $scope.getAlbum = album => {
      this.$scope.tracks = album.tracks;

      if ($scope.play_prev_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack($scope.tracks.length - 1);
        $scope.play_prev_album = false;
      }

      if ($scope.play_next_album) {
        $rootScope.tracks = $scope.tracks;
        MediaPlayer.loadTrack(0);
        $scope.play_next_album = false;
      }

      
    }

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
        $timeout(() => {
          $scope.coverflow = coverflow('player').setup({
            playlist: $rootScope.starred_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function() {
            this.on('focus', index => {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });

            this.on('click', (index, link) =>  {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });
          });
        });
      }

    });

  }

}

export default {
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};