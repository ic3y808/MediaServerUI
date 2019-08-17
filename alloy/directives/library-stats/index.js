var electron = require("electron");
var { ipcRenderer } = electron;
module.exports = function ($rootScope) {
  return {
    restrict: "E",
    templateUrl: "library-stats.jade",
    replace: true,
    link: ($scope, elm, attrs) => {
      ipcRenderer.on("system-stats", (args, e) => {
        $scope.library_stats = e;
        $rootScope.update();
      });

      ipcRenderer.send("system-get-stats");
    }
  };
};