'use strict';

ChromecastService.$inject = ['$http', '$rootScope', '$route', '$window'];

function ChromecastService($http, $rootScope, $route, $window) {
  var isCastAvailable = false;
  window.__onGCastApiAvailable = function (isAvailable) {
    console.log('cast status ' + isAvailable)
    isCastAvailable = isAvailable;
  };

  return {
    castStatus: function () {
      return isCastAvailable;
    },
    initializeCast: function (caller) {
      if (isCastAvailable) {
        var options = {};
        options.receiverApplicationId = 'DAB06F7C';
        options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
        cast.framework.CastContext.getInstance().setOptions(options);
        $rootScope.remotePlayer = new cast.framework.RemotePlayer();
        $rootScope.remotePlayerController = new cast.framework.RemotePlayerController($rootScope.remotePlayer);
        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
          $rootScope.switchPlayer
        );

        $rootScope.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
      }

    }
  };
};

module.exports = ChromecastService;