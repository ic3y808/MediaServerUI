import './playlist.scss';
class PlaylistController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Logger.debug('playlist-controller');

    $rootScope.$watch('tracks', (newVal, oldVal) =>  {
      AppUtilities.apply();
      AppUtilities.hideLoader();
    });


  }
}

export default {
  bindings: {},
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
};