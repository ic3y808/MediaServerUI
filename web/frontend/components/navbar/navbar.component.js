import './navbar.scss';
class NavbarController {
  constructor($scope, $rootScope, $location, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService, $http) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('nav-controller');   
  }

  $onInit() {
  }
}

export default {
  bindings: {},
  controller: NavbarController,
  templateUrl: '/template/navbar.jade'
};