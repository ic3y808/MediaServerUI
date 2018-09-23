var controllers = angular.module('controllers-status', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('statusController', ['$rootScope', '$scope', 'subsonicService', function($rootScope, $scope, subsonicService) {
	console.log('status-controller')
	
	$scope.ping = function(){
		var ping = subsonicService.ping();
		if(ping){
			ping.then(function(data) {
				console.log('ping ' + data);
				$scope.server = data;
				$scope.$apply();
			});
		}	
	}

	$rootScope.$on('loginStatusChange', function (event, data) {
		$scope.ping();
	});

	$scope.refreshIntereval = setInterval(function(){
		$scope.ping();
	}, 5000)


	$scope.$on('$destroy', function () { clearInterval($scope.refreshIntereval); });
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
	$scope.ping();
}]);