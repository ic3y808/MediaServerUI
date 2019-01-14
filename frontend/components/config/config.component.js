import './config.scss';
class ConfigController {
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
    this.Backend.debug('config-controller');
    var that = this;


    this.$scope.jumpTo = function (to) {
      that.$location.path('/config/' + to);
    };

    this.$scope.navigate = function (to) {
      $('.PageContentBody-contentBody').append(that.$compile("<config" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
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
  controller: ConfigController,
  templateUrl: '/template/config.jade'
};