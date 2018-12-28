import './status.scss';
class StatusController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('status-controller');
    var that = this;

    $scope.ping = function () {
      var ping = that.AlloyDbService.ping();
      if (ping) {
        ping.then(function (data) {
          that.Backend.debug('ping');
          $scope.alloydb = data;
          that.AppUtilities.apply();
        });
      }

    };

    $scope.getLibraryInfo = function () {
      var libraryInfo = that.AlloyDbService.getLibraryInfo();
      if (libraryInfo) {
        libraryInfo.then(function (info) {
          $scope.libraryInfo = info;
          that.AppUtilities.apply();
        });
      }
    };

    $scope.getMediaPaths = function () {
      var mediaPaths = that.AlloyDbService.getMediaPaths();
      if (mediaPaths) {
        mediaPaths.then(function (paths) {
          that.Backend.debug('getMediaPaths');
          $scope.mediaPaths = paths;
          that.AppUtilities.apply();
        });
      }
    };

    $scope.scanStart = function () {
      var scanner = that.AlloyDbService.scanStart();
      if (scanner) {
        scanner.then(function (result) {
          that.Backend.debug('startScan');
          $scope.scanStatus = result;
          that.AppUtilities.apply();
          $scope.rescanInterval = setInterval(function () {
            $scope.getScanStatus();
          }, 500);
        });
      }
    };

    $scope.getScanStatus = function () {
      var scanner = that.AlloyDbService.scanStatus();
      if (scanner) {
        scanner.then(function (result) {
          $scope.scanStatus = result;
          that.AppUtilities.apply();
          if (!$scope.scanStatus.result.isScanning) {
            clearInterval($scope.rescanInterval);
          } else {
            if (!$scope.rescanInterval) {
              $scope.rescanInterval = setInterval(function () {
                $scope.getScanStatus();
              }, 500);
            }
          }
        });
      }
      $scope.getLibraryInfo();
    };

    $scope.scanCancel = function () {
      var scanner = that.AlloyDbService.scanCancel();
      if (scanner) {
        scanner.then(function (result) {
          that.Backend.debug('cancelScan');
          $scope.scanStatus = result;
          that.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
      $scope.getLibraryInfo();
      $scope.getMediaPaths();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(function () {
      AppUtilities.apply();
    }, 1000);


    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
      clearInterval($scope.rescanInterval);
    });
    $scope.ping();
    $scope.getLibraryInfo();
    $scope.getMediaPaths();
    setTimeout(() => {
      $scope.getScanStatus();
    }, 500);
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: StatusController,
  templateUrl: '/template/status.jade'
};