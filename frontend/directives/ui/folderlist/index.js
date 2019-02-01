module.exports = function ($rootScope, $location, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist: '@',
      hasjumpbar: '@'
    },
    templateUrl: '/template/folderlist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      
    }
  }
};