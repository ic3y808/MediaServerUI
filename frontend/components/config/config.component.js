import './config.scss';
class ConfigController {
  constructor($scope, $rootScope, $compile, $routeParams, AppUtilities, Backend, MediaPlayer, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.$routeParams = $routeParams;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('config-controller');
    var that = this;


    this.$scope.navigate = function (to) {
      $('.configBodyWrapper').append(that.$compile("<config" + to + "/>")(that.$scope));
      that.AppUtilities.apply();
    };

    this.$scope.configSubsonic = function () {
      that.Backend.debug('configSubsonic');
      that.$scope.navigate('subsonic');
    };

    this.$scope.configSabnzbd = function () {
      that.Backend.debug('configSabnzbd');
      that.$scope.navigate('sabnzbd');
    };

    this.$rootScope.triggerConfigAlert = function (message, type) {
      $('.generalConfigBodyWrapper').append('<div class="alert alert-' + type + ' config-alert notification" role="alert">' + message + '</div>');
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