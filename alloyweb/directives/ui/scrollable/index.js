export default function () {
  "ngInject";
  return {
    restrict: "C",
    link: function (scope, element, attrs) {
      $(".scrollable").mouseenter(function (event) {
        var parentOffset = $(this).parent().offset();
        var relX = event.pageX - parentOffset.left;
        var maxOffset = 35;
        var offsetWidth = $(this).outerWidth() - maxOffset;

        if (relX - offsetWidth > 0) {
          $(this).addClass("hide-scrollbar")

        } else $(this).removeClass("hide-scrollbar")
      });
      $(".scrollable").mousemove(function (event) {
        var parentOffset = $(this).parent().offset();
        var relX = event.pageX - parentOffset.left;
        var maxOffset = 35;
        var offsetWidth = $(this).outerWidth() - maxOffset;
        //$(this).parent().css({
        //  "margin-right":  maxOffset + "px"
        //});
        if (relX - offsetWidth > 0) {
          $(this).addClass("hide-scrollbar")

        } else $(this).removeClass("hide-scrollbar")
      });
      $(".scrollable").mouseleave(function (event) {
        $(this).removeClass("hide-scrollbar")
      });
    }
  };
}