export default function ($rootScope, $location, Logger, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      data: "=",
      title: "@",
      limit: "@",
      type: "@",
      refreshclick: "&",
      viewmorelink: "@"
    },
    templateUrl: "/template/itemtable.jade",
    replace: true,
    link: function (scope, elm, attrs) {
    
    }
  }
};