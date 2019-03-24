export default function ($window) {
  "ngInject";
  return {
    restrict: 'AE',
    templateUrl: '/template/linkbutton.jade',
    replace: true,
    scope: {
      relid: '@',
      buttontext: '@',
      buttonicon: '@',
      data: '='
    },
    controller: ["$scope", "$attrs", "$element", "$compile",
      function ($scope, $attrs, $element, $compile) {
        "ngInject";

        $scope.$watch('data', function (oldVal, newVal) {
          if ($scope.data) {
            $scope.init();
          }
        })

        $scope.init = function () {
          $scope.isOpen = false;
          $scope.template = '<div class="popover" role="tooltip">' +
            '<div class="arrow">' +
            '</div>' +
            '<h3 class="popover-header"></h3>' +
            '<div class="popover-body"></div>' +
            '</div>';
          $scope.content = [];
          $scope.data.forEach(tag => {
            $scope.content.push("<div class='Details-Label Label-label Label-default Label-large' ng-click='linkClick(\"" + tag.target + "\")'>" + tag.type + "</div>")
          });
          $element.popover({
            template: $scope.template,
            content: function () {
              return $compile($scope.content.join(''))($scope);
            },
            html: true,
            trigger: "manual",
            container: '.PageContentBody-contentBody',
            placement: "bottom",
          });

          $('body').on('click', function (e) {
            if (!($element.is(e.target) || $element.has(e.target).length > 0)) {
              $scope.closePopup();
            }
          });

          $element.on('click', function (e) {
            if ($scope.isOpen === true)
              $scope.closePopup();
            else
              $scope.showLinks();
          });
        };

        $scope.showLinks = function () {
          $scope.isOpen = true;
          $element.popover('show');
        };

        $scope.closePopup = function () {
          $scope.isOpen = false;
          $element.popover('hide')
        };

        $scope.linkClick = function (link) {
          $window.open(link.replace("\"", ""), '_blank');
        }
      }
    ]
  }
}