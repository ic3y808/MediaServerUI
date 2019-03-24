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

    $scope.settings = {};



    $scope.ping = () => {
      var ping = this.AlloyDbService.getSchedulerStatus();
      if (ping) {
        ping.then(data => {
          this.Logger.debug('getSchedulerStatus');
          this.$scope.schedulerStatus = data;
          this.AppUtilities.apply();
        });
      }
    };


    $rootScope.$on('menuSizeChange', (event, currentState) => {

    });

    $rootScope.$on('windowResized', (event, data) => {

    });


    $rootScope.$on('loginStatusChange', (event, data) => {
      $scope.ping();
    });

    $scope.refreshIntereval = setInterval(() => {
      $scope.ping();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(() => {
      AppUtilities.apply();
    }, 1000);


    $scope.$on('$destroy', () => {
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