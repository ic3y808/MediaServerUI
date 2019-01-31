module.exports = function (Backend, AppUtilities, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: '/template/historylist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      
    }
  }
};