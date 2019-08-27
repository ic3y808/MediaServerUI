class LoginController {
  constructor($scope, $rootScope, $element, $location, AuthenticationService, Logger) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.$location = $location;
    this.AuthenticationService = AuthenticationService;
    this.Logger = Logger;
    this.Logger.debug("login-controller");
    $scope.login = function () {
      $scope.dataLoading = true;
      AuthenticationService.Login($scope.username, $scope.password, function (response) {
        if (response.success) {
          AuthenticationService.SetCredentials($scope.username, $scope.password);
          $location.path("/");
        } else {
          //FlashService.Error(response.message);
          $scope.dataLoading = false;
        }
      });
    };
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
    this.AuthenticationService.ClearCredentials();
  }
}

export default {
  bindings: {},
  controller: LoginController,
  templateUrl: "/template/login.jade"
};