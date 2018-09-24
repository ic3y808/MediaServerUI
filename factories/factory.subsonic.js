var factories = angular.module('factories-subsonic', []);

factories.factory('subsonicService', function ($http, $rootScope, $route, $window) {
  $rootScope.isLoggingIn = true;
  $rootScope.isLoggedIn = false;

  var doLogin = function () {

    if ($rootScope.settings && $rootScope.settings.subsonic_username !== undefined && $rootScope.settings.subsonic_password !== undefined) {
      if (!$rootScope.isLoggedIn) {
        console.log('logging into subsonic')
          
        $rootScope.subsonic = new SubsonicAPI({
          https: $rootScope.settings.subsonic_use_ssl,
          ip: $rootScope.settings.subsonic_address,
          port: $rootScope.settings.subsonic_port,
          user: $rootScope.settings.subsonic_username,
          password: CryptoJS.AES.decrypt($rootScope.settings.subsonic_password.toString(), "12345").toString(CryptoJS.enc.Utf8),
          appName: 'Test',
          md5Auth: true
        });

        document.addEventListener('subsonicApi-ready', event => {
          console.log(event.detail.status);
          if (event.detail.status === 'ok') {
            console.log('connected to subsonic')
            $rootScope.isLoggingIn = false;
            $rootScope.isLoggedIn = true;
          } else {
            console.log('failed to connect to subsonic')
            $rootScope.isLoggingIn = false;
            $rootScope.isLoggedIn = false;
          }
          $rootScope.$broadcast('loginStatusChange', $rootScope.isLoggedIn);
        });
      }
    }
  }
  
  return {
    login: doLogin,
    ping: function () {
      doLogin();
      if ($rootScope.isLoggedIn)
        return $rootScope.subsonic.ping();
      else return false;
    }
  }
});