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
    templateUrl:"/template/contextmenu.jade",
    replace: true,
    link: function (scope, elm, attrs) {

    }
  };
}

