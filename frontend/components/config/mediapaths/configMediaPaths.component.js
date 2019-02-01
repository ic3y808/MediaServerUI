class ConfigMediaPathsController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('config-mediapaths-controller');
    var that = this;
    $scope.settings = {};
  
   


    AppUtilities.hideLoader();

   
  }
}

export default {
  bindings: {},
  controller: ConfigMediaPathsController,
  templateUrl: '/template/configMediaPaths.jade'
};