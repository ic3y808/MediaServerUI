
class ConfigGeneralController {
  constructor($scope, $rootScope, Logger, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Logger.debug('general-config-controller');
    var that = this;
   
  }
}

export default {
  bindings: {},
  controller: ConfigGeneralController,
  templateUrl: '/template/configGeneral.jade',

};