export default function(Backend, AppUtilities, AlloyDbService) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    templateUrl: "/template/queuelist.jade",
    replace: true,
    link: function(scope, elm, attrs) {
      scope.makePercent = function(percent) {
        return percent.value + "%";
      };

      scope.humanFileSize = function(size) {
        var i = Math.floor(Math.log(size.value) / Math.log(1024));
        return (
          (size.value / Math.pow(1024, i)).toFixed(2) * 1 +
          " " +
          ["B", "kB", "MB", "GB", "TB"][i]
        );
      };
    }
  };
}
