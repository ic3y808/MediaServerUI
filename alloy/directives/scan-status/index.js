var electron = require("electron");
var { ipcRenderer } = electron;
module.exports = function ($rootScope) {
  return {
    restrict: "E",
    scope: {
      scan_status: "@",
      showQueue: "@"
    },
    templateUrl: "scan-status.jade",
    replace: true,
    link: ($scope, elm, attrs) => {

      $scope.cancelScan = function () {
        ipcRenderer.send("mediascanner-scan-cancel");
      };

      ipcRenderer.on("mediascanner-status", (args, e) => {
        $scope.scan_status = e;
        $rootScope.update();
      });
    }
  };
};