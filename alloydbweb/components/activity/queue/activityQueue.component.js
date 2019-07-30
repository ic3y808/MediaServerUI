class ActivityQueueController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Logger.debug("activity-queue-controller");
    this.AppUtilities.showLoader();

    this.$scope.queue = [];

    $scope.$on("$destroy", () => {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on("sabnzbdQueueResult", (event, data) => {
      this.Logger.debug("sabnzbd queue result");
      $scope.queue = JSON.parse(data);
      AppUtilities.updateGridRows($scope.gridOptions);
      this.AppUtilities.apply();
      this.AppUtilities.hideLoader();
    });

    $scope.refreshIntereval = setInterval(() => {
      if (this.$rootScope.socket) { this.$rootScope.socket.emit("get_sabnzbd_queue"); }
    }, 1000);


  }
}

export default {
  bindings: {},
  controller: ActivityQueueController,
  templateUrl: "/template/activityQueue.jade"
};