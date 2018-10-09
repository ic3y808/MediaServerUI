class PlaylistsController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('playlists-controller')
    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
  }
}

export default {
  bindings: {},
  controller: PlaylistsController,
  templateUrl: '/template/playlists.jade'
};