import "./status.scss";
class StatusController {
  constructor($scope, $rootScope, $timeout, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("status-controller");

    $scope.ping = () => {
      var ping = this.AlloyDbService.ping();
      if (ping) {
        ping.then( data => {
          $scope.alloydb = data;
          this.AppUtilities.apply();
        });
      }
    };

    $scope.getLibraryInfo = () => {
      var libraryInfo = this.AlloyDbService.getLibraryInfo();
      if (libraryInfo) {
        libraryInfo.then(info => {
          $scope.libraryInfo = info;
          this.AppUtilities.apply();
        });
      }
    };

    $scope.getMediaPaths = () => {
      var mediaPaths = this.AlloyDbService.getMediaPaths();
      if (mediaPaths) {
        mediaPaths.then(paths => {
          $scope.mediaPaths = paths;
          this.AppUtilities.apply();
        });
      }
    };

    $scope.scanFullStart = () => {
      var scanner = this.AlloyDbService.scanFullStart();
      if (scanner) {
        scanner.then(result => {
          this.Logger.debug("scanFullStart");
          $scope.scanStatus = result;
          this.AppUtilities.apply();
          $scope.rescanInterval = setInterval(() => {
            $scope.getScanStatus();
          }, 500);
        });
      }
    };

    $scope.scanQuickStart = () => {
      var scanner = this.AlloyDbService.scanQuickStart();
      if (scanner) {
        scanner.then(result =>{
          this.Logger.debug("scanQuickStart");
          $scope.scanStatus = result;
          this.AppUtilities.apply();
          $scope.rescanInterval = setInterval(() => {
            $scope.getScanStatus();
          }, 500);
        });
      }
    };

    $scope.getScanStatus = () => {
      var scanner = this.AlloyDbService.scanStatus();
      if (scanner) {
        scanner.then(result => {
          $scope.scanStatus = result;
          this.AppUtilities.apply();
          if (!$scope.rescanInterval) {
            $scope.rescanInterval = setInterval(() => {
              $scope.getScanStatus();
            }, 500);
          }
        });
      }
      $scope.getLibraryInfo();
    };

    $scope.scanCancel = () => {
      var scanner = this.AlloyDbService.scanCancel();
      if (scanner) {
        scanner.then(result => {
          this.Logger.debug("cancelScan");
          $scope.scanStatus = result;
          this.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on("loginStatusChange", (event, data) =>  {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
    });

    $scope.refreshIntereval = setInterval(() => {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(() => {
      AppUtilities.apply();
    }, 1000);

    $scope.$on("$destroy", () => {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
      clearInterval($scope.rescanInterval);
    });

    $timeout(() => {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
      $scope.getScanStatus();
    }, 500);
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: StatusController,
  templateUrl: "/template/status.jade"
};
