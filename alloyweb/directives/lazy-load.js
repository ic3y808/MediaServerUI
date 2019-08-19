export default function () {
  "ngInject";
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      function loadImg(changes) {
        changes.forEach((change) => {
          if (change.intersectionRatio > 0 && change.target.getAttribute("tempData")) {
            change.target.src = change.target.getAttribute("tempData");
          }
        });
      }
      const observer = new IntersectionObserver(loadImg);
      const img = angular.element(element)[0];
      observer.observe(img);
    }
  };
}

