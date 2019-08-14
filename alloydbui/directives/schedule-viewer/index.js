var electron = require("electron");
var { ipcRenderer } = electron;
module.exports = function ($rootScope) {
  return {
    restrict: "E",
    scope: {
      scan_status: "@"
    },
    templateUrl: "schedule-viewer.jade",
    replace: true,
    link: ($scope, elm, attrs) => {
      $scope.runTask = function (task) {
        ipcRenderer.send("scheduler-run-task", task);
      };
      
      ipcRenderer.on("scheduler-current-schedule", (args, e) => {
        $scope.schedule = e;
        $rootScope.update();
      });

      ipcRenderer.send("scheduler-get-schedule");
    }
  };
};