import './playlist.scss';
class PlaylistController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('playlist-controller');
    var that = this;


   

  }
}

export default {
  bindings: {},
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
};