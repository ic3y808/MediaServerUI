import _ from "lodash";
export default function ($rootScope, $location, $timeout, Logger) {
  "ngInject";
  return {
    restrict: "AC",
    template: "",
    priority: -1000,
    scope: {
      data: "="
    },
    link: function (scope, element, attrs) {
      var debounce = _.debounce(() => {
        var pos = $rootScope.scrollPos[$location.path()];
        $(".scrollsaver").scrollTop(pos);
        $rootScope.okSaveScroll = true;
      }, 500)
      var observer = new MutationObserver(function (mutations) {
        $timeout(debounce);
      });

      observer.observe(element[0], {
        childList: true,
        subtree: true
      });

      $rootScope.$on("$routeChangeStart", function () {
        $rootScope.okSaveScroll = false;
      });

      $rootScope.scrollClear = function (path) {
        $rootScope.scrollPos[path] = 0;
      };

      element.bind("scroll", (event) => {
        if ($rootScope.okSaveScroll) {
          $rootScope.scrollPos[$location.path()] = $(".scrollsaver").scrollTop();
        }
      });
    }
  };
}