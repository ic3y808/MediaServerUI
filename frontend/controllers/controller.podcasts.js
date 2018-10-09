var controllers = angular.module('controllers-podcasts', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('podcastsController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('podcasts-controller')

	
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);