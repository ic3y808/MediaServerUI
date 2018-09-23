var controllers = angular.module('controllers-home', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('homeController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('home-controller')

	
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);