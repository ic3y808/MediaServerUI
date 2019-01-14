import './activity.scss';
class ActivityController {
  constructor($scope, $rootScope, $compile, $routeParams, $location, AppUtilities, Backend, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.Backend.debug('activity-controller');
    var that = this;


    this.$scope.jumpTo = function (to) {
      that.$location.path('/activity/' + to);
    };

    this.$scope.navigate = function (to) {
      $('.PageContentBody-contentBody').append(that.$compile("<activity" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
    };

    this.$scope.configQueue = function () {
      that.Backend.debug('activityQueue');
      that.$scope.navigate('queue');
    };

    this.$scope.configHistory = function () {
      that.Backend.debug('activityHistory');
      that.$scope.navigate('history');
    };

    this.$scope.configBlacklist = function () {
      that.Backend.debug('activityBlacklist');
      that.$scope.navigate('blacklist');
    };

    this.$rootScope.triggerConfigAlert = function (message, type) {
      $('.PageContentBody-contentBody').append('<div class="alert alert-' + type + ' config-alert notification" role="alert">' + message + '</div>');
      setTimeout(() => {
        $('.config-alert').hide(500);
      }, 3000);
    };

    AppUtilities.apply();
    AppUtilities.hideLoader();
  }

  $onInit() {
    if (this.$routeParams.id) {
      this.Backend.debug('navigating to ' + this.$routeParams.id);
      this.$scope.navigate(this.$routeParams.id);
    }
  }
}

export default {
  bindings: {},
  controller: ActivityController,
  templateUrl: '/template/activity.jade'
};