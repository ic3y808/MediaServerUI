export default function () {
  "ngInject";
  return {
    restrict: "C",
    link: function (scope, element, attrs) {
      $(".scrollable").mouseenter(function (event) {
        if (event.pageX >= $(this).width() - ($(this).width() * 0.1)) {
          $(this).addClass("hide-scrollbar");
        } else $(this).removeClass("hide-scrollbar")
      });
      $(".scrollable").mousemove(function (event) {
        if (event.pageX >= $(this).width() - ($(this).width() * 0.1)) {
          $(this).addClass("hide-scrollbar")

        } else $(this).removeClass("hide-scrollbar")
      });
      $(".scrollable").mouseleave(function (event) {
        $(this).removeClass("hide-scrollbar")
      });
    }
  };
}