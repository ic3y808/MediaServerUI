var controllers = angular.module('controllers-playlist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('playlistController', ['$rootScope', '$scope', '$sce', 'subsonicService', function($rootScope, $scope, $sce, subsonicService) {
	console.log('playlist-controller')


	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);

