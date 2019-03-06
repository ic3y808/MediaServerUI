
class ChartsController {
  constructor($scope, $rootScope, $element, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Cache = Cache;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('charts-controller');
 

  }

  $onInit() {
    this.$element.addClass('vbox')
    this.$element.addClass('scrollable')
  };
}

export default {
  bindings: {},
  controller: ChartsController,
  templateUrl: '/template/charts.jade'
};