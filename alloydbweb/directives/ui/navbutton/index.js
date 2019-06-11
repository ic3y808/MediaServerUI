export default function () {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      buttontext: "@",
      href: "@",
      direction: "@",
      buttonclick: "&"
    },
    // object is passed while making the call
    template: "<a title=\"{{buttontext}}\" href=\"{{href}}\" class=\"PageContent-HeaderDetails-navigation-button IconButton-button Link-link Link-link\">" +
      " <svg aria-hidden=\"true\" data-prefix=\"fas\" data-icon=\"arrow-circle-left\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" style=\"font-size: 30px;\" class=\"svg-inline--fa fa-arrow-circle-left fa-w-16 Icon-default\">" +
      "  <path ng-show=\"{{direction == \"left\"}}\"  fill=\"currentColor\" d=\"M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm28.9-143.6L209.4 288H392c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24H209.4l75.5-72.4c9.7-9.3 9.9-24.8.4-34.3l-11-10.9c-9.4-9.4-24.6-9.4-33.9 0L107.7 239c-9.4 9.4-9.4 24.6 0 33.9l132.7 132.7c9.4 9.4 24.6 9.4 33.9 0l11-10.9c9.5-9.5 9.3-25-.4-34.3z\"></path>" +
      "   <path ng-show=\"{{direction == \"right\"}}\" fill=\"currentColor\" d=\"M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4z\"></path>" +
      " </svg>" +
      "</a>",
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      };
      scope.text = scope.buttontext;
    }
  };
}