export default function ($rootScope, $location, $timeout, $window) {
  "ngInject";
  return {
    restrict: 'AC',
    template: '',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      "ngInject";
      var observer = new MutationObserver(function (mutations) {
        $timeout(function () {
          var pos = $rootScope.scrollPos[$location.path()];
         // console.log($location.path() + " " + pos);
          $(".scrollsaver").scrollTop(pos);
          $rootScope.okSaveScroll = true;
        });
      });
      observer.observe(element[0], {
        childList: true,
        subtree: true
      });


      $rootScope.$on('$routeChangeStart', function () {
        $rootScope.okSaveScroll = false;
      });


      $rootScope.scrollClear = function (path) {
        $rootScope.scrollPos[path] = 0;
      }

      element.bind("DOMMouseScroll mousewheel onmousewheel", event => {
        if ($rootScope.okSaveScroll) {
          $rootScope.scrollPos[$location.path()] = $(".scrollsaver").scrollTop();
        }
      });
    }
  }
};