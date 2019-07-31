import "./database.scss";
class DatabaseController {
  constructor($scope, $rootScope, $element, Logger) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Logger = Logger;

    this.Logger.debug("database-controller");
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: DatabaseController,
  templateUrl: "/template/database.jade"
};