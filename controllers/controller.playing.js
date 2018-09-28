var controllers = angular.module('controllers-playing', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('playingController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('playing-controller')

	
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);