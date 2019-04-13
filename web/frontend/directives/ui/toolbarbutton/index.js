export default function () {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      buttontext: "@",
      buttonid: "@",
      buttonrel: "@",
      buttonicon: "@",
      buttonclick: "&"
    },
    // object is passed while making the call
    template: "<button type=\"button\" id=\"{{buttonid}}\" ng-click=\"clickButton()\" class=\"PageToolbarButton-toolbarButton Link-link\" rel=\"{{buttonrel}}\">" +
      "	<i aria-hidden=\"true\" data-prefix=\"fas\" class=\"fa {{buttonicon}} fa-w-16 Icon-default\"></i>" +
      "	<div class=\"PageToolbarButton-labelContainer\">" +
      "		<div class=\"PageToolbarButton-label\">{{buttontext}}</div>" +
      "	</div>" +
      "</button>",
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
      scope.text = scope.buttontext;
    }
  }
};