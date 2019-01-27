module.exports = function ($timeout) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      onfocus: '&',
      onclick: '&',
      coverwidth: '@',
      coverheight: '@',
      width: '@',
    },
    // object is passed while making the call
    template: '<div id="player" style="overflow: hidden;"/>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.$watch('data', function (newVal, oldVal) {
        if (scope.data.length > 0) {
          $timeout(function () {
            scope.clickButton = function (idx, link) {
              scope.onclick(idx, link);
            }

            scope.coverflow = coverflow('player').setup({
              playlist: scope.data,
              width: scope.width,
              coverwidth: scope.coverwidth,
              coverheight: scope.coverheight,
              fixedsize: true,
            }).on('ready', function () {
              this.on('focus', scope.onfocus);
              this.on('click', scope.clickButton);
            });
          });
        }
      });
    }
  }
};