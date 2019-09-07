
import { findIndex } from "lodash";
class HistoryController {
  constructor($scope, $rootScope, $element, Logger, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Logger = Logger;
    this.AlloyDbService = AlloyDbService;

    this.Logger.debug("history-controller");

    $scope.refresh = function () {
      AlloyDbService.refreshHistory();
    };

    $rootScope.$watch("history", function (newVal, oldVal) {
      if ($rootScope.history) {
        AppUtilities.apply();
      }
    });

    $rootScope.$on("GotoNowPlaying", (event, data) => {
      if ($rootScope.currentTrack) {
        $(".scrollable").scrollTo("#" + $rootScope.currentTrack.id);
      }
    });
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");
  }
}

export default {
  bindings: {},
  controller: HistoryController,
  templateUrl: "/template/history.jade"
};