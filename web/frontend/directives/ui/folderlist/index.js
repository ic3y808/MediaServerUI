export default function ($rootScope, $location, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      currentpath: "="
    },
    templateUrl: "/template/folderlist.jade",
    replace: true,
    link: function (scope, elm, attrs) {


      var reload = function () {
        if (AlloyDbService.isLoggedIn) {
          var fileList = AlloyDbService.getFileList(scope.currentpath);
          if (fileList) {
            fileList.then(function (result) {

              if (scope.currentpath === null || scope.currentpath == undefined || scope.currentpath == "") {

                scope.driveList = result;


                AppUtilities.apply();

              } else {
                scope.driveList = null;

                scope.folderlist = result;
                scope.folderlist.unshift({ Name: "..", Path: ".." });
                AppUtilities.apply();
              }

            });
          }
        }
      };

      scope.navigateToPath = function (path) {
        if (path === "..") {

          var parent = AlloyDbService.getFileParent(scope.currentpath);
          if (parent) {
            parent.then(function (result) {
              if (result.path === "") {
                scope.currentpath = "";
                scope.folderlist = null;
              } else {
                scope.currentpath = result.path;
              }

              reload();
            });

          }
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

      $rootScope.$on("loginStatusChange", function (event, data) {
        reload();
      });

      reload();


    }
  };
}