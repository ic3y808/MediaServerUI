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

    this.$scope.jumpTo = to => {
      $location.path('/activity/' + to);
    };

    this.$scope.navigate = to => {
      $('.PageContentBody-contentBody').append(this.$compile("<activity" + to + "/>")(this.$scope));
      this.AppUtilities.apply();
    };

    this.$scope.configQueue = () =>  {
      this.Logger.debug('activityQueue');
      this.$scope.navigate('queue');
    };

    this.$scope.configHistory = () =>  {
      this.Logger.debug('activityHistory');
      this.$scope.navigate('history');
    };

    this.$scope.configBlacklist = () => {
      this.Logger.debug('activityBlacklist');
      this.$scope.navigate('blacklist');
    };

    this.AppUtilities.apply();
    this.AppUtilities.hideLoader();

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