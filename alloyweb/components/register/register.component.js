class RegisterController {
  constructor($scope, $rootScope, $element, $location, Logger, UserService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.$location = $location;
    this.Logger = Logger;
    this.UserService = UserService;
    this.Logger.debug("register-controller");
    $scope.register = function () {
      $scope.dataLoading = true;
      UserService.Create($scope.user)
        .then(function (response) {
          if (response.success) {
            //FlashService.Success("Registration successful", true);
            $location.path("/login");
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
  }
}

export default {
  bindings: {},
  controller: RegisterController,
  templateUrl: "/template/register.jade"
};