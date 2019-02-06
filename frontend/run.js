

export default function ApplicationRun($window, $rootScope, $location, $timeout, Backend, MediaPlayer, AppUtilities) {
  "ngInject";
  Backend.debug('starting application');
  $rootScope.settings = [];
  $rootScope.scrollPos = {};

  $rootScope.$on('$routeChangeStart', function () {
    $rootScope.okSaveScroll = false;
  });

  $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
    $timeout(function () { // wait for DOM, then restore scroll position
      $('#mainContentBody').scrollTop($rootScope.scrollPos[$location.path()] ? $rootScope.scrollPos[$location.path()] : 0);
      $rootScope.okSaveScroll = true;
    }, 0);
    AppUtilities.broadcast('windowResized');
  });

  document.addEventListener('scroll', function (event) {
    if ($rootScope.okSaveScroll) {
      $rootScope.scrollPos[$location.path()] = $('#mainContentBody').scrollTop();
    }
  }, true);

  $rootScope.scrollClear = function (path) {
    $rootScope.scrollPos[path] = 0;
  }

  var windowResized = AppUtilities.debounce(function () {
    AppUtilities.broadcast('windowResized');
  }, 25);

  $(window).on('resize', windowResized);

  $window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    var focus = $("#search-box").val();
    if(!focus){
      if (key === 32) {
        e.preventDefault();
      }
    }
  }

  $window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    var focus = $("#search-box").val();
    if(!focus){
      if (key === 32) {
        e.preventDefault();
        MediaPlayer.toggleCurrentStatus();
      }
    }
    
  }

  //$window.onbeforeunload = function () {
  //  return "Are you sure to leave this page?";
  //}

  $timeout(function () {
    Backend.debug('loading settings');
    Backend.emit('load_settings', 'alloydb_settings');
    Backend.emit('load_settings', 'sabnzbd_settings');

    setTimeout(() => {
      if (MediaPlayer.castStatus()) {
        Backend.debug('cast status true, initialize cast');
        MediaPlayer.initializeCast();
      }
    }, 1000);
  });
}