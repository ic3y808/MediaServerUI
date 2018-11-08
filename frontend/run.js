

export default function ApplicationRun($window, $rootScope, Backend, MediaPlayer, AppUtilities) {
  "ngInject";
  Backend.debug('starting application');

  $rootScope.settings = [];

  $rootScope.$on('$routeChangeStart', function ($event, next, current) {
    $(".main-content").css("display", "none");
    $(".loader").css("display", "block");
  });

  $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
    Backend.debug('routeChangeSuccess');
    AppUtilities.broadcast('windowResized');
    AppUtilities.broadcast('menuSizeChange');
  });



  var windowResized = AppUtilities.debounce(function () {
    AppUtilities.broadcast('windowResized');
  }, 25);

  $(window).on('resize', windowResized);
  Backend.debug('loading settings');
  Backend.emit('load_subsonic_settings');
  Backend.emit('load_sabnzbd_settings');

  setTimeout(() => {
    if (MediaPlayer.castStatus()) {
      Backend.debug('cast status true, initialize cast');
      MediaPlayer.initializeCast();
    }
  }, 1000);

  $window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if(key === 32){
      MediaPlayer.togglePlayPause();  
    }
  }
  $window.onbeforeunload = function () {
    return "Are you sure to leave this page?";
  }

}

