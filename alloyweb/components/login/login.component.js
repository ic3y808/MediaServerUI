import AlloyDbService from "../../services/alloyDbService.service";

class LoginController {
  constructor($scope, $rootScope, $element, $location, AppUtilities, AuthenticationService, Logger) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.$location = $location;
    this.AppUtilities = AppUtilities;
    this.AuthenticationService = AuthenticationService;
    this.Logger = Logger;
    this.Logger.debug("login-controller");
    this.$scope.canLogIn = false;
    this.$scope.login = () => {
      this.$scope.status = undefined;
      this.$scope.dataLoading = true;
      var encryptedUser = this.AppUtilities.encryptPassword(this.$scope.username);
      var encryptedUser2 = this.AppUtilities.encryptPassword(this.$scope.username);
      var encryptedPass = this.AppUtilities.encryptPassword(this.$scope.password);
      this.AuthenticationService.Login(encryptedUser, encryptedPass, (response) => {
        if (response.success) {
          this.AuthenticationService.SetCredentials(encryptedUser, encryptedPass);
          this.$location.path("/");
          this.$location.replace();
        } else {
          this.$scope.status = response.message;
          this.$scope.dataLoading = false;
        }
        this.AppUtilities.apply();
      });
    };

    $("#loginForm").parsley().on("field:validated", () => {
      var ok = $(".parsley-error").length === 0;
      $(".bs-callout-info").toggleClass("hidden", !ok);
      $(".bs-callout-warning").toggleClass("hidden", ok);
    })
      .on("form:submit", () => {
        var ok = $(".parsley-error").length === 0;
        if (ok && this.$scope.canLogIn) {
          $scope.login();
        }
      });

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("login reload on loginsatuschange");
      this.$scope.canLogIn = data.isLoggingIn;
      this.AppUtilities.apply();
    });

    this.$scope.canLogIn = AlloyDbService.isLoggingIn;
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