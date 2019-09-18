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
      "ngInject";
      var debounce = _.debounce(()=>{
        var pos = $rootScope.scrollPos[$location.path()];
        $(".scrollsaver").scrollTop(pos);
        $rootScope.okSaveScroll = true;
        Logger.debug("set page position")
      },500)
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
          Logger.debug("saving position for " + $location.path() + " at " +  $(".scrollsaver").scrollTop())
          $rootScope.scrollPos[$location.path()] = $(".scrollsaver").scrollTop();
        }
      });
    }
  };
}