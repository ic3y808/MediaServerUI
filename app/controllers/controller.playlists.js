'use strict';

PlaylistsController.$inject = ['$rootScope', '$scope', 'subsonicService'];

function PlaylistsController($rootScope, $scope, subsonicService) {
  $(".content").css("display", "none");
  $(".loader").css("display", "block");
  console.log('playlists-controller')


  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
};

module.exports = PlaylistsController;