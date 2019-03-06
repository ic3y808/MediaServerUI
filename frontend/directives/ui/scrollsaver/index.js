export default function ($rootScope, $location,$timeout) {
  "ngInject";
  return {
    restrict: 'AC',
    template:'',

    link: function (scope, element, attrs) {
      "ngInject";

      

      $rootScope.$on('$routeChangeStart', function () {
        $rootScope.okSaveScroll = false;
      });
    
      $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
        $timeout(function () { // wait for DOM, then restore scroll position'
        var pos = $rootScope.scrollPos[$location.path()];
        angular.element(element)[0].scrollTop = pos;
          $rootScope.okSaveScroll = true;
        }, 0);
      });
    
    
      $rootScope.scrollClear = function (path) {
        $rootScope.scrollPos[path] = 0;
      }

      element.bind("DOMMouseScroll mousewheel onmousewheel", event => {

        if ($rootScope.okSaveScroll) {
          console.log($location.path() + " " + element[0].scrollTop)
          $rootScope.scrollPos[$location.path()] = element[0].scrollTop;
        }
        // cross-browser wheel delta
        var event = window.event || event; // old IE support
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        var value = 0;
        if (delta < 0) {
          value = -0.05;
        } else if (delta > 0) {
          value = 0.05;
        }
        console.log(value);
      });
    }
  }
};