class DatabaseController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("database-controller");

    $scope.currentpath = "";
    $scope.display_name = "";
    $scope.selectedBackup = {};

    $scope.scanStart = () => {
      this.$scope.scan_status = { status: "starting scan", isScanning: true };
      this.AlloyDbService.scanStart();
    };

    $scope.scanCancel = () => {
      this.$scope.scan_status = "cancelling scan";
      this.AlloyDbService.scanCancel().then((result) => {
        this.$scope.scan_status = result.result;
      });
    };

    $scope.clearCache = () => {
      this.AlloyDbService.clearCache().then((result) => {
        this.$scope.cache_status = result.result;
        setTimeout(() => {
          this.$scope.cache_status = undefined;
        }, 3000);
      });
    };

    $scope.clearStarredCache = () => {
      this.AlloyDbService.clearStarredCache().then((result) => {
        this.$scope.cache_status = result.result;
        setTimeout(() => {
          this.$scope.cache_status = undefined;
        }, 3000);
      });
    };


    $scope.addBackup = () => {
      $(".file-upload-input").trigger("click");
    };

    $scope.backupFileAdded = (input) => {
      if (input.files && input.files[0]) {
        this.$rootScope.socket.emit("disconnect_db");
        this.AlloyDbService.restore(input.files[0]);
      }
    };

    $scope.startBackup = () => {
      this.$scope.backup_results = "Starting Backup";
      this.AlloyDbService.backup().then((result) => {
        this.$scope.backup_results = result.result;
        this.AppUtilities.apply();
        setTimeout(() => {
          this.$scope.backup_results = null;
          this.AppUtilities.apply();
        }, 5000);
      });
    };

    $scope.removePath = (mediaPath) => {
      var removeMediaPath = AlloyDbService.removeMediaPath(mediaPath);
      if (removeMediaPath) {
        removeMediaPath.then(function (result) {
          $scope.reload();
        });
      }
    };

    $scope.browsePaths = () => {
      $scope.currentpath = "";
      $scope.display_name = "";
      AppUtilities.apply();

      var $this = $(this)
        , $remote = $this.data("remote") || $this.attr("href")
        , $modal = $("#addMediaPathModal");
      $("#primary-content").append($modal);
      $modal.modal();
      // $modal.load($remote);

      // $("#addMediaPathModal").modal()
    };

    $scope.addCurrentPath = () => {
      var addMediaPath = AlloyDbService.addMediaPath({ display_name: $scope.display_name, path: $scope.currentpath });
      if (addMediaPath) {
        addMediaPath.then((result) => {

          $scope.reload();
        });
      }
      $("#addMediaPathModal").modal("hide");
    };

    $scope.reload = () => {
      if (AlloyDbService.isLoggedIn) {
        var mediaPaths = AlloyDbService.getMediaPaths();
        if (mediaPaths) {
          mediaPaths.then((paths) => {
            $scope.mediaPaths = paths;
            AppUtilities.apply();
          });
        }
      }
    };

    $scope.refreshIntereval = setInterval(() => {
      var status = this.AlloyDbService.scanStatus();
      if (status) {
        status.then((result) => {
          this.$scope.scan_status = result.result;
          this.AppUtilities.apply();
        });
      }
    }, 2000);

    $scope.$on("$destroy", () => {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on("loginStatusChange", function (event, data) {
      $scope.reload();
    });

    $scope.reload();
  }
}

export default {
  bindings: {},
  controller: DatabaseController,
  templateUrl: "/template/configDatabase.jade"
};