PlaylistsController.$inject = ['$scope', '$rootScope'];

function PlaylistsController($scope, $rootScope) {
  console.log('playlists-controller')


  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
}

export default PlaylistsController;
