class PodcastsController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('podcasts-controller');
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: PodcastsController,
  templateUrl: '/template/podcasts.pug'
};