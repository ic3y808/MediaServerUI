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
    this.AppUtilities.showLoader();
    var that = this;


    this.$scope.jumpTo = function (to) {
      that.$location.path('/config/' + to);
    };

    this.$scope.navigate = function (to) {
      $('.PageContentBody-contentBody').append(that.$compile("<config" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
    };

    this.$scope.toggleAdvanced = function () {
     $rootScope.settings.advanced_mode = !$rootScope.settings.advanced_mode;
      that.AppUtilities.apply();
    };

    this.$rootScope.triggerConfigAlert = function (message, type) {
      //$('.PageContentBody-contentBody').append('<div class="alert alert-' + type + ' config-alert notification" role="alert">' + message + '</div>');
      setTimeout(() => {
        // $('.config-alert').hide(500);
        $('#saveSettingsButton').popover('hide');
      }, 3000);

      // $('#saveSettingsButton').popover('show');
    };


    var t = '<div class="popover" role="tooltip">' +
      '<div class="arrow">' +
      '</div>' +
      '<h3 class="popover-header"></h3>' +
      '<div class="popover-body"></div>' +
      '</div>';


    $('body').popover({
      html: true,
      selector: '[rel=save-settings-popover]',
      trigger: 'click',
      template: t,
      content: "Success!",
      //container: '.PageContentBody-contentBody',
      placement: "bottom",
    });


    


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