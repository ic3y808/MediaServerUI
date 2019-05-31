export default function () {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      buttontext: "@",
      buttonicon: "@",
      buttonclick: "&",
      href: "@"
    },
    // object is passed while making the call
    templateUrl:"/template/detaillabel.jade",
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      };
    }
  };
}

