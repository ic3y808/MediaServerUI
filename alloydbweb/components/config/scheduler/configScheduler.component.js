import CryptoJS from "crypto-js";
class ConfigSchedulerController {
  constructor($scope, $rootScope, Logger, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("scheduler-controller");

    $scope.settings = {};


    $scope.getSchedule = () => {
      var schedule = this.AlloyDbService.getSchedulerStatus();
      if (schedule) {
        schedule.then((data) => {
          this.Logger.debug("getSchedulerStatus");
          this.$scope.schedulerStatus = data;
          this.AppUtilities.apply();
        });
      }
    };


    $rootScope.$on("menuSizeChange", (event, currentState) => {

    });

    $rootScope.$on("windowResized", (event, data) => {

    });


    $rootScope.$on("loginStatusChange", (event, data) => {
      $scope.getSchedule();
    });

    $scope.refreshIntereval = setInterval(() => {
      $scope.getSchedule();
    }, 20000);

    $scope.uiRefreshIntereval = setInterval(() => {
      AppUtilities.apply();
    }, 1000);

    $scope.$on("$destroy", () => {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
    });

    $scope.getSchedule();


  }
}

export default {
  bindings: {},
  controller: ConfigSchedulerController,
  templateUrl: "/template/configScheduler.jade"

};