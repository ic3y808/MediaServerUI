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

    this.$scope.settings = {};


    this.$scope.getSchedule = () => {
      var schedule = this.AlloyDbService.getSchedulerStatus();
      if (schedule) {
        schedule.then((data) => {
          this.Logger.debug("getSchedulerStatus");
          this.$scope.schedulerStatus = data;
          this.AppUtilities.apply();
        });
      }
    };

    this.$scope.executeTask = (task) => {
      this.AlloyDbService.startTask(task).then(() => {
        this.$scope.getSchedule();
      });
    };


    this.$rootScope.$on("menuSizeChange", (event, currentState) => {

    });

    this.$rootScope.$on("windowResized", (event, data) => {

    });


    this.$rootScope.$on("loginStatusChange", (event, data) => {
      $scope.getSchedule();
    });

    this.$scope.refreshIntereval = setInterval(() => {
      $scope.getSchedule();
    }, 20000);

    this.$scope.uiRefreshIntereval = setInterval(() => {
      AppUtilities.apply();
    }, 1000);

    this.$scope.$on("$destroy", () => {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
    });

    this.$scope.getSchedule();


  }
}

export default {
  bindings: {},
  controller: ConfigSchedulerController,
  templateUrl: "/template/configScheduler.jade"

};