import CryptoJS from 'crypto-js';
class ConfigSchedulerController {
  constructor($scope, $rootScope, Logger, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('scheduler-controller');
    var that = this;
    $scope.settings = {};

    var that = this;

    $scope.ping = function () {
      var ping = that.AlloyDbService.getSchedulerStatus();
      if (ping) {
        ping.then(function (data) {
          that.Logger.debug('getSchedulerStatus');
          that.$scope.schedulerStatus = data;
          that.AppUtilities.apply();
        });
      }
    };


    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });


    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(function () {
      AppUtilities.apply();
    }, 1000);


    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
    });


  }
}

export default {
  bindings: {},
  controller: ConfigSchedulerController,
  templateUrl: '/template/configScheduler.jade'

};