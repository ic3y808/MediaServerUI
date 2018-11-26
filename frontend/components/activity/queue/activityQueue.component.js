
class ActivityQueueController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('activity-queue-controller');
    var that = this;
   
  }
}

export default {
  bindings: {},
  controller: ActivityQueueController,
  templateUrl: '/template/activityQueue.pug',

};