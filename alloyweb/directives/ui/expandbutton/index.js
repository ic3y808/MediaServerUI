export default function () {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      direction: "@"
    },
    // object is passed while making the call
    template: "",
    link: function (scope, element, attrs) {

      if (attrs.mini) {
        var t1 = "<svg aria-hidden=\"true\" data-prefix=\"fas\" data-icon=\"chevron-circle-up\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" style=\"font-size: 20px;\" class=\"svg-inline--fa fa-chevron-circle-up fa-w-16 Icon-default\">" +
          "	<path fill=\"currentColor\" d=\"M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z\"></path>" +
          "</svg>";
        element.html(t1);
      } else {
        var t2 = "<span title=\"Hide albums\">" +
          "  <svg aria-hidden=\"true\" data-prefix=\"fas\" data-icon=\"chevron-circle-{{direction}}\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" style=\"font-size: 24px;\" class=\"svg-inline--fa fa-chevron-circle-down fa-w-16 ExpanderContainer-expandButtonIcon ExpanderContainer-actionButton IconButton-button Link-link Icon-default\">";

        switch (scope.direction) {
          case "up":
            t2 += "	<path fill=\"currentColor\" d=\"M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z\"></path>";
            break;
          case "down":
            t2 += "   <path fill=\"currentColor\" d=\"M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM273 369.9l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L256 285.1 154.4 183.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L239 369.9c9.4 9.4 24.6 9.4 34 0z\"></path>";
            break;
        }

        t2 += "  </svg>" +
          "</span>";

        element.html(t2);
      }
    },
    replace: true
  };
}