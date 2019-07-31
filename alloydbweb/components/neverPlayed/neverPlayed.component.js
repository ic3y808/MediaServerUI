class NeverPlayedController {
  constructor($scope, $rootScope, $element, Logger, AppUtilities) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.AppUtilities = AppUtilities;
    this.Logger = Logger;
    this.Logger.debug("never-played-controller");
    this.AppUtilities.showLoader();
  }

  $onInit() {
    this.$element.addClass("vbox");
  }
}

export default {
  bindings: {},
  controller: NeverPlayedController,
  templateUrl: "/template/neverPlayed.jade"
};
