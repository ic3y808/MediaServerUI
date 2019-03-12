export default function ($rootScope, $location, Logger, Backend, AppUtilities, AlloyDbService, MediaPlayer) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      title: '@',
      limit: '@',
      type: '@',
      refreshclick: '&',
      viewmorelink: '@'
    },
    templateUrl: 'template/thumblist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      
    }
  }
};
