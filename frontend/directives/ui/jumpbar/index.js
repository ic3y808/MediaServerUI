export default function () {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      buttonclick: '&'
    },
    templateUrl: 'template/jumpbar.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function (x) {
        
        if (x === '#') {
          $("#symbol")[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "end", inline: "nearest"
          });
        } else {
          $("#" + x)[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "end", inline: "nearest"
          });
        }
      }
    }
  }
};