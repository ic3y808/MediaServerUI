var controllers = angular.module('controllers-settings', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('settingsController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('settings-controller')

	$scope.saveSettings = function(){
		console.log('save settings');
		console.log($rootScope.settings);
		$rootScope.socket.emit('save_settings',$rootScope.settings);
	}

	$rootScope.socket.emit('load_settings'); 
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);