import "./genres.scss";
class GenresController {
  constructor($scope, $rootScope, $location, $element, Logger, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$element = $element;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("genres-controller");
    this.AppUtilities.showLoader();
    
    $scope.refresh = function () {
      AlloyDbService.refreshGenres();
    };

    $rootScope.$watch("genres", function (newVal, oldVal) {
      if ($rootScope.genres) {
        AppUtilities.apply();
        AppUtilities.hideLoader();
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
  controller: GenresController,
  templateUrl: "/template/genres.jade"
};