import './status.scss';
class StatusController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('status-controller');
    var that = this;
    $scope.ping = function () {
      if (that.SubsonicService.isLoggedIn) {
        var ping = that.SubsonicService.ping();
        if (ping) {
          ping.then(function (data) {
            that.Backend.debug('ping');
            that.Backend.debug(data);
            $scope.server = data;
          });
        }
      }
    };

    $scope.getUserInfo = function () {
      if (that.SubsonicService.isLoggedIn) {
        that.SubsonicService.subsonic.getUserInfo().then(function (userInfo) {
          that.Backend.debug('getUserInfo');
          that.Backend.debug(userInfo);
          $scope.userInfo = userInfo;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      }
    };

    $scope.getMediaFolders = function () {
      if (that.SubsonicService.isLoggedIn) {
        that.SubsonicService.subsonic.getMusicFolders().then(function (data) {
          $scope.folders = data;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      }
    };

    $scope.startScan = function () {
      if (that.SubsonicService.isLoggedIn) {
        that.SubsonicService.subsonic.startScan().then(function (data) {
          $scope.scanStatus = data;
          $scope.scanStatusTotalFiles = data.count;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $scope.rescanInterval = setInterval(function () {
            $scope.getScanStatus();
          }, 500);
        });
      }
    };

    $scope.getScanStatus = function () {
      if (that.SubsonicService.isLoggedIn) {
        that.SubsonicService.subsonic.getScanStatus().then(function (data) {
          $scope.scanStatus = data;
          if ($scope.scanStatus.count === $scope.scanStatusTotalFiles) {
            clearInterval($scope.rescanInterval);
          }
          $scope.$apply();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
      $scope.getUserInfo();
      $scope.getMediaFolders();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
      $scope.getUserInfo();
      $scope.getMediaFolders();
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
    $scope.getUserInfo();
    $scope.getMediaFolders();
    AppUtilities.hideLoader();
  }
}

export default {
  bindings: {},
  controller: StatusController,
  templateUrl: '/template/status.jade'
};