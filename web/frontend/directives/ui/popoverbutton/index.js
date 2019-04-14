export default function () {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      relid: "@",
      buttontext: "@",
      buttonicon: "@",
      data: "="
    },
    // object is passed while making the call
    templateUrl: "/template/popoverbutton.jade",
    replace: true,

    link: function (scope, elm, attrs) {
      scope.$watch("data", function (newVal, oldVal) {
        if (scope.data) {
          var t = "<div class=\"popover\" role=\"tooltip\">" +
            "<div class=\"arrow\">" +
            "</div>" +
            "<h3 class=\"popover-header\"></h3>" +
            "<div class=\"popover-body\"></div>" +
            "</div>";
          var content = [];
          scope.data.forEach((tag) => {
            content.push("<div class=\"Details-Label Label-label Label-default Label-large\">" + tag.name + "</div>");
          });


          $("body").popover({
            html: true,
            selector: "[rel=popover-button-" + scope.relid + "]",
            trigger: "click",
            template: t,
            content: content.join(""),
            container: ".PageContentBody-contentBody",
            placement: "bottom",
          });
        }
      });
    }
  };
}