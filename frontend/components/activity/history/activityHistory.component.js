class ActivityHistoryController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Logger.debug('activity-history-controller');
    this.AppUtilities.showLoader();
    var that = this;
    this.$scope.history = [];
   
    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on('sabnzbdHistoryResult', function (event, data) {
      that.Logger.debug('sabnzbd history result');
      $scope.history = JSON.parse(data);
      that.AppUtilities.apply();
      that.AppUtilities.hideLoader();
    });

    $scope.refreshIntereval = setInterval(function () {
      if(this.$rootScope.socket)
       this.$rootScope.socket.emit('get_sabnzbd_history');
    }, 10000);
  }
}

export default {
  bindings: {},
  controller: ActivityHistoryController,
  templateUrl: '/template/activityHistory.jade'
};