module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: 'template/genrelist.jade',
     
    replace: true,
    link: function (scope, elm, attrs) {
   
    }
  }
};