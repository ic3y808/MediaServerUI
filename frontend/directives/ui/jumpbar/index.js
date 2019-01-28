module.exports = function ($location, $anchorScroll) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      buttonclick: '&'
    },
    // object is passed while making the call 
    template:
      '<div class="PageJumpBar-jumpBar">' +
      '   <div class="PageJumpBar-jumpBarItems">' +
      '     <a href="#" class="Link-link PageJumpBarItem-jumpBarItem" ng-repeat="artist in data" ng-click="clickButton(artist.name)">{{artist.name}}</a>' +
      '  </div>' +
      '</div>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function (x) {
        var newHash = x;
        $("#" + x)[0].scrollIntoView({
          behavior: "smooth", // or "auto" or "instant"
          block: "start" // or "end"
        });
      }
    }
  }
};
