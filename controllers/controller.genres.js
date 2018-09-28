var controllers = angular.module('controllers-genres', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('genresController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('genres-controller')

	
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);