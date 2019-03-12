export default function ($rootScope, $location, Logger, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
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
    templateUrl: 'template/itemlist.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.itemLimit = parseInt(scope.limit);

      switch(scope.type){
        case 'tracks': break;
        case 'albums': break;
        case 'artists': break;
      }
    }
  }
};