var electron = require("electron");
var { ipcRenderer } = electron;
var moment = require("moment");

module.exports = function ($rootScope) {
  return {
    restrict: "E",
    scope: {
      currentSelectedPath: "@",
      currentSelectedPathDisplayName: "@"
    },
    templateUrl: "log-viewer.jade",
    replace: true,
    link: ($scope, elm, attrs) => {
      $scope.logLevels = {
        "type": "select",
        "name": "Log Levels",
        "value": "info",
        "values": ["all", "info", "debug", "error"]
      };

      $scope.checkLogEntry = function (entry) {
        if (entry.level === "error") { return "error-row"; }
      };

      $scope.filterLogEntry = function () {
        return function (item) {
          if ($scope.logLevels.value === "all") { return true; }
          return item.level === $scope.logLevels.value.toLowerCase();
        };
      };

      $scope.formatTime = function (time) {
        if (time) {
          var t = moment(time).format("YYYY-MM-DD hh:mm:ss");
          return t;
        }
        return "";
      };

      ipcRenderer.on("logger-logs", (args, e) => {
        if (e) {
          $scope.logs = e;
          $rootScope.update();
        }
      });
      $(".selectpicker").selectpicker();
      ipcRenderer.send("logger-get-logs");
    }
  };
};