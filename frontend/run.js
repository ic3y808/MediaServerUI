

export default function ApplicationRun($window, $rootScope, Backend, MediaPlayer, AppUtilities) {
  "ngInject";
  Backend.debug('starting application');
  $rootScope.settings = [];

  $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
    Backend.debug('routeChangeSuccess');
    AppUtilities.broadcast('windowResized');

  });

  var windowResized = AppUtilities.debounce(function () {
    AppUtilities.broadcast('windowResized');
  }, 25);

  $(window).on('resize', windowResized);
  Backend.debug('loading settings');
  Backend.emit('load_settings', 'alloydb_settings');
  Backend.emit('load_settings', 'sabnzbd_settings');

  setTimeout(() => {
    if (MediaPlayer.castStatus()) {
      Backend.debug('cast status true, initialize cast');
      MediaPlayer.initializeCast();
    }
  }, 1000);

  $window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key === 32) {
      e.preventDefault();
    }
  }

  $window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key === 32) {
      e.preventDefault();
      MediaPlayer.toggleCurrentStatus();
    }
  }

  //$window.onbeforeunload = function () {
  //  return "Are you sure to leave this page?";
  //}
}