class ActivityQueueController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('activity-queue-controller');
    this.AppUtilities.showLoader();
    var that = this;
    this.$scope.queue = [];
    
    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on('sabnzbdQueueResult', function (event, data) {
      that.Backend.debug('sabnzbd queue result');
      $scope.queue = JSON.parse(data);
      AppUtilities.updateGridRows($scope.gridOptions);
      that.AppUtilities.apply();
      that.AppUtilities.hideLoader();
    });

    $scope.refreshIntereval = setInterval(function () {
      Backend.emit('get_sabnzbd_queue');
    }, 1000);


  }
}

export default {
  bindings: {},
  controller: ActivityQueueController,
  templateUrl: '/template/activityQueue.jade'
};