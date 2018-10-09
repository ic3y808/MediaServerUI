var controllers = angular.module('controllers-playlists', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('playlistsController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('playlists-controller')

	
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);