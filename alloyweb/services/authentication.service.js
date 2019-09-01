export default class AuthenticationService {
  constructor($cookies, $http, $rootScope, $timeout, Logger, UserService, AlloyDbService) {
    "ngInject";
    this.$cookies = $cookies;
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.Logger = Logger;
    this.UserService = UserService;
    this.AlloyDbService = AlloyDbService;
    
  }

  Login(username, password, callback) {
    this.AlloyDbService.loginUser({ username: username, password: password }).then((status) => {
      if (status.result === "success") { callback({ success: true }); }
      else { callback({ success: false, message: "Username or password is incorrect" }); }
    });
  }

  SetCredentials(username, password) {
    var authdata = username + ":" + password;

    this.$rootScope.globals = {
      currentUser: {
        username: username,
        authdata: authdata
      }
    };

    // set default auth header for http requests
    this.$http.defaults.headers.common["Authorization"] = "Basic " + authdata;

    // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
    var cookieExp = new Date();
    cookieExp.setDate(cookieExp.getDate() + 7);
    this.$cookies.putObject("globals", this.$rootScope.globals, { expires: cookieExp });
  }

  ClearCredentials() {
    this.$rootScope.globals = {};
    this.$cookies.remove("globals");
    this.$http.defaults.headers.common.Authorization = "Basic";
  }
}