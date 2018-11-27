import './playlists.scss';
class PlaylistsController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('playlists-controller');
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: PlaylistsController,
  templateUrl: '/template/playlists.jade'
};