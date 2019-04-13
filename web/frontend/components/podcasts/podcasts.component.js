import "./podcasts.scss";
class PodcastsController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Logger.debug("podcasts-controller");
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: PodcastsController,
  templateUrl: "/template/podcasts.jade"
};