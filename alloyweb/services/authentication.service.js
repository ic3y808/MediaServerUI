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
    /* Dummy authentication for testing, uses $timeout to simulate api call
     ----------------------------------------------*/
    //this.$timeout(() => {
    //  var response = null;
    //  this.UserService.GetByUsername(username)
    //    .then(function (user) {
    //      if (user !== null && user.password === password) {
    //        response = { success: true };
    //      } else {
    //        response = { success: false, message: "Username or password is incorrect" };
    //      }
    //      callback(response);
    //    });
    //}, 1000);

    /* Use this for real authentication
     ----------------------------------------------*/
    //$http.post('/api/authenticate', { username: username, password: password })
    //    .success(function (response) {
    //        callback(response);
    //    });

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