import '../API/cast.framework';
import '../API/cast.v1';
var isCastAvailable = false;
window.__onGCastApiAvailable = function (isAvailable) {
  console.log('cast status ' + isAvailable);
  isCastAvailable = isAvailable;
};

export default class ChromecastService {
  constructor($rootScope) {
    "ngInject";
    this.$rootScope = $rootScope;
  }

  castStatus() {
    return isCastAvailable;
  }

  initializeCast(caller) {
    if (isCastAvailable) {
      var options = {};
      options.receiverApplicationId = 'DAB06F7C';
      options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
      cast.framework.CastContext.getInstance().setOptions(options);
      this.$rootScope.remotePlayer = new cast.framework.RemotePlayer();
      this.$rootScope.remotePlayerController = new cast.framework.RemotePlayerController(this.$rootScope.remotePlayer);
      this.$rootScope.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        this.$rootScope.switchPlayer
      );

      this.$rootScope.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    }
  }
}