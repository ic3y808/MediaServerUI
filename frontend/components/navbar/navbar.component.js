import './navbar.scss';
class NavbarController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('nav-controller');

    $( "#search-box" ).mouseleave(function() {
      $('#search-box').blur();
    });

    $( "#search-box" ).mouseenter(function() {
      $('#search-box').focus();
    });
  }

  $onInit(){
  }
}

export default {
  bindings: {},
  controller: NavbarController,
  templateUrl: '/template/navbar.pug'
};