import "./navbar.scss";
class NavbarController {
  constructor($scope, $rootScope, $location, $window, Logger, MediaElement, MediaPlayer, AuthenticationService, AppUtilities, Backend, AlloyDbService, $http) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$window = $window;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AuthenticationService = AuthenticationService;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("nav-controller");

    this.$scope.refreshCurrentView = function () {
      AlloyDbService.refreshPage(window.location.pathname);
    };
    
    this.$scope.logout = () => {
      this.AuthenticationService.ClearCredentials();
      this.$location.path("/login");
      this.$location.replace();
    };
  }

  $onInit() {
  }
}

export default {
  bindings: {},
  controller: NavbarController,
  templateUrl: "/template/navbar.jade"
};