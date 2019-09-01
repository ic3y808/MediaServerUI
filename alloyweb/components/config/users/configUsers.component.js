import CryptoJS from "crypto-js";
class ConfigUsersController {
  constructor($scope, $rootScope, $routeParams, $timeout, $element, AlloyDbService, AppUtilities, Backend, Cache, Logger, MediaElement, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$timeout = $timeout;
    this.$element = $element;
    this.AlloyDbService = AlloyDbService;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Cache = Cache;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.Logger.debug("config-shares-controller");

    $scope.refresh = () => {
      this.Logger.debug("refresh shares");
      this.AlloyDbService.refreshUsers();
    };

    $scope.createUser = () => {
      this.Logger.info("Creating user");
      this.AlloyDbService.createUser();
    };

    $scope.deleteUser = (id) => {
      this.Logger.info("Deleting user");
      this.AlloyDbService.deleteUser(id).then(() => {
        $scope.refresh();
      });
    };

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Shares reload on loginsatuschange");
      $scope.refresh();
    });

    $scope.refresh();
  }
}

export default {
  bindings: {},
  controller: ConfigUsersController,
  templateUrl: "/template/configUsers.jade"
};