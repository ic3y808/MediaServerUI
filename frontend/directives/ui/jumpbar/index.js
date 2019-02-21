export default function () {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      buttonclick: '&'
    },
    template:
      '<div class="PageJumpBar-jumpBar">' +
      '   <div class="PageJumpBar-jumpBarItems">' +
      '     <a href="#" class="Link-link PageJumpBarItem-jumpBarItem" ng-repeat="artist in data" ng-click="clickButton(artist.name)">{{artist.name}}</a>' +
      '  </div>' +
      '</div>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function (x) {
        if (x === '#') {
          $("#symbol")[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "start" // or "end"
          });
        } else {
          $("#" + x)[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "start" // or "end"
          });
        }
      }
    }
  }
};