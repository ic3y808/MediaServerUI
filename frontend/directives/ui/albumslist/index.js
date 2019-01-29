module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist: '@'
    },
    templateUrl:'/template/albumslist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
      scope.text = scope.buttontext;
      console.log("scope.show_artist  " + scope.showartist)
    }
  }
};