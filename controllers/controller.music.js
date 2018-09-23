var controllers = angular.module('controllers-music', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('musicController', ['$rootScope', '$scope', 'subsonicService', 'DTOptionsBuilder', 'DTColumnBuilder', function ($rootScope, $scope, subsonicService, DTOptionsBuilder, DTColumnBuilder) {
	console.log('music-controller')
	$scope.artists = [];
	$scope.dtInstance = {};	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');

	$scope.getArtists = function (artistsCollection, callback) {
		var artists = [];
		artistsCollection.forEach(artistHolder => {
			artistHolder.artist.forEach(artist => {
				artists.push(artist);
			});
		});

		Promise.all(artists).then(function (artistsResult) {
			callback(artistsResult);
		});
	}

	$scope.reloadArtists = function () {
		if ($rootScope.isLoggedIn) {
			$scope.artists = [];
			$rootScope.subsonic.getArtists().then(function (artistsCollection) {
				$scope.getArtists(artistsCollection, function (result) {
					$scope.artists = result;
					$scope.$apply();
				})
			});
		}
	}

	$rootScope.$on('loginStatusChange', function (event, data) {
		console.log('music reloading on subsonic ready')
		$scope.reloadArtists();
	});

	$scope.reloadArtists();

	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);