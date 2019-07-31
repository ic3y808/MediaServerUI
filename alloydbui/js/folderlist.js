require("angular");
var { ipcRenderer } = require("electron");
angular.module("alloydb").directive("folderlist", function () {
  return {
    restrict: "E",
    scope: { currentpath: "=" },
    templateUrl: "folderlist.jade",
    replace: true,
    link: function (scope, element, attrs) {
      var reload = function () {
        ipcRenderer.send("config-get-file-list", scope.currentpath);
      };

      ipcRenderer.on("config-file-list", (e, result) => {
        if (scope.currentpath === null || scope.currentpath === undefined || scope.currentpath === "") {
          scope.driveList = result;
        } else {
          scope.driveList = null;
          scope.folderlist = result;
          if (Array.isArray(scope.folderlist)) { scope.folderlist.unshift({ Name: "..", Path: ".." }); }
        }
        scope.$apply();
      });

      ipcRenderer.on("config-file-parent", (e, result) => {
        if (result.path === "") {
          scope.currentpath = "";
          scope.folderlist = null;
        } else {
          scope.currentpath = result.path;
        }
        reload();
      });

      scope.navigateToPath = function (path) {
        if (path === "..") {
          ipcRenderer.send("config-get-file-parent", scope.currentpath);
        } else {
          scope.currentpath = path;
          reload();
        }
      };


      scope.$watch("currentpath", function (event, data) {
        scope.driveList = null;
        scope.folderlist = null;
        reload();
      });

      setTimeout(() => {
        reload();
      }, 5500);


    } //DOM manipulation
  };
});
