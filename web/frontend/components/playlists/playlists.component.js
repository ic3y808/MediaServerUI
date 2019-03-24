import './playlists.scss';
class PlaylistsController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Logger.debug('playlists-controller');
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: PlaylistsController,
  templateUrl: '/template/playlists.jade'
};