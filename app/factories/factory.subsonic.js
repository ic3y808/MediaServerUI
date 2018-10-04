'use strict';

SubsonicService.$inject = ['$http', '$rootScope', '$route', '$window'];

function SubsonicService($rootScope, $scope, subsonicService) {
  $rootScope.isLoggingIn = true;
  $rootScope.isLoggedIn = false;

  var generateConnectionString = function () {
    var url = 'http://';
    if ($rootScope.settings.subsonic_use_ssl)
      url = 'https://';
    url += $rootScope.settings.subsonic_address;
    if ($rootScope.settings.subsonic_include_port_in_url)
      url += ':' + $rootScope.settings.subsonic_port;

    return url;
  }

  var doLogin = function () {

    if ($rootScope.settings && $rootScope.settings.subsonic_username && $rootScope.settings.subsonic_password) {
      if (!$rootScope.isLoggedIn) {
        console.log('logging into subsonic')

        var ip = $rootScope.settings.subsonic_address;
        if ($rootScope.settings.subsonic_include_port_in_url === true)
          ip = ':' + $rootScope.settings.subsonic_port;
        $rootScope.subsonic = new SubsonicAPI({
          https: $rootScope.settings.subsonic_use_ssl,
          ip: ip,
          port: $rootScope.settings.subsonic_port,
          user: $rootScope.settings.subsonic_username,
          password: CryptoJS.AES.decrypt($rootScope.settings.subsonic_password.toString(), "12345").toString(CryptoJS.enc.Utf8),
          appName: 'MediaServerUI',
          md5Auth: true
        });

        document.addEventListener('subsonicApi-ready', event => {
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
};

module.exports = SubsonicService;