StatusController.$inject = ['$rootScope', '$scope', 'subsonicService'];

function StatusController($rootScope, $scope, subsonicService) {
  $(".content").css("display", "none");
  $(".loader").css("display", "block");
  console.log('status-controller')

  $scope.ping = function () {
    if ($rootScope.isLoggedIn) {
      var ping = subsonicService.ping();
      if (ping) {
        ping.then(function (data) {
          console.log('ping ' + data);
          $scope.server = data;
          $scope.$apply();
        });
      }
    }
  };

  $scope.getUserInfo = function () {
    if ($rootScope.isLoggedIn) {
      $rootScope.subsonic.getUserInfo().then(function (userInfo) {
        console.log('ping ' + userInfo);
        $scope.userInfo = userInfo;
        $scope.$apply();
      });
    }
  };

  $scope.getMediaFolders = function () {
    if ($rootScope.isLoggedIn) {
      $rootScope.subsonic.getMusicFolders().then(function (data) {

        $scope.folders = data;
        $scope.$apply();
      });
    }
  };

  $scope.startScan = function () {
    if ($rootScope.isLoggedIn) {
      $rootScope.subsonic.startScan().then(function (data) {
        $scope.scanStatus = data;
        $scope.scanStatusTotalFiles = data.count;
        $scope.$apply();
        $scope.rescanInterval = setInterval(function () {
          $scope.getScanStatus();
        }, 500);
      });
    }
  };

  $scope.getScanStatus = function () {
    if ($rootScope.isLoggedIn) {
      $rootScope.subsonic.getScanStatus().then(function (data) {
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


  $scope.$on('$destroy', function () {
    clearInterval($scope.refreshIntereval);
    clearInterval($scope.rescanInterval);
  });
  $scope.ping();
  $scope.getUserInfo();
  $scope.getMediaFolders();
  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
};

module.exports = StatusController;