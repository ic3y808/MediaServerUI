class ActivityController {
  constructor($scope, $rootScope, $compile, $routeParams, $location, Logger, AppUtilities, Backend, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.Logger.debug('activity-controller');
    var that = this;


    this.$scope.jumpTo = function (to) {
      that.$location.path('/activity/' + to);
    };

    this.$scope.navigate = function (to) {
      $('.PageContentBody-contentBody').append(that.$compile("<activity" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
    };

    this.$scope.configQueue = function () {
      that.Logger.debug('activityQueue');
      that.$scope.navigate('queue');
    };

    this.$scope.configHistory = function () {
      that.Logger.debug('activityHistory');
      that.$scope.navigate('history');
    };

    this.$scope.configBlacklist = function () {
      that.Logger.debug('activityBlacklist');
      that.$scope.navigate('blacklist');
    };

    AppUtilities.apply();
    AppUtilities.hideLoader();

  }

  $onInit() {
    if (this.$routeParams.id) {
      this.Logger.debug('navigating to ' + this.$routeParams.id);
      this.$scope.navigate(this.$routeParams.id);
    }
  }
}

export default {
  bindings: {},
  controller: ActivityController,
  templateUrl: '/template/activity.jade'
};