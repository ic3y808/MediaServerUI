var electron = require("electron");
var { ipcRenderer } = electron;
module.exports = function ($rootScope) {
  return {
    restrict: "E",
    $scope: {
      currentSelectedPath: "@",
      currentSelectedPathDisplayName: "@"
    },
    templateUrl: "media-path-picker.jade",
    replace: true,
    link: ($scope, elm, attrs) => {
      $scope.addMediaPath = function () {
        $scope.currentSelectedPathDisplayName = "";
        $scope.currentSelectedPath = "";
      };

      $scope.addCurrentPath = function () {
        ipcRenderer.send("config-add-media-path", { display_name: $scope.currentSelectedPathDisplayName, path: $scope.currentSelectedPath });
        $scope.currentSelectedPathDisplayName = "";
        $scope.currentSelectedPath = "";
      };

      $scope.removeMediaPath = function (mediaPath) {
        ipcRenderer.send("config-remove-media-path", { display_name: mediaPath.display_name, path: mediaPath.path });
      };

      ipcRenderer.on("config-media-paths", (args, e) => {
        $scope.media_paths = e;
        $rootScope.update();
      });

      var reload = function () {
        ipcRenderer.send("config-get-file-list", $scope.currentSelectedPath);
      };

      ipcRenderer.on("config-file-list", (e, result) => {
        if ($scope.currentSelectedPath === null || $scope.currentSelectedPath === undefined || $scope.currentSelectedPath === "") {
          $scope.driveList = result;
        } else {
          $scope.driveList = null;
          $scope.folderlist = result;
          if (Array.isArray($scope.folderlist)) { $scope.folderlist.unshift({ Name: "..", Path: ".." }); }
        }
        $scope.$apply();
      });

      ipcRenderer.on("config-file-parent", (e, result) => {
        if (result.path === "") {
          $scope.currentSelectedPath = "";
          $scope.folderlist = null;
        } else {
          $scope.currentSelectedPath = result.path;
        }
        reload();
      });

      $scope.navigateToPath = function (path) {
        if (path === "..") {
          ipcRenderer.send("config-get-file-parent", $scope.currentSelectedPath);
        } else {
          $scope.currentSelectedPath = path;
          reload();
        }
      };


      $scope.$watch("currentSelectedPath", function (event, data) {
        $scope.driveList = null;
        $scope.folderlist = null;
        reload();
      });

      setTimeout(() => {
        reload();
      }, 5500);

      ipcRenderer.send("config-get-media-paths");
    }
  };
};