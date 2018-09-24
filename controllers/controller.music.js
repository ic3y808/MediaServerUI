var controllers = angular.module('controllers-music', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('musicController', ['$rootScope', '$scope', '$location', '$sce', 'subsonicService', 'DTOptionsBuilder', 'DTColumnBuilder', function ($rootScope, $scope, $location, $sce, subsonicService, DTOptionsBuilder, DTColumnBuilder) {
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

					var table = $('#musicTable').DataTable();

					$('#musicTable tbody').on('click', 'tr', function () {
						var data = table.row( this ).data();
						$location.path("/artist/" + data[0]);
						$scope.$apply();
					} );
				
					$('#musicTable tbody').on( 'click', 'tr', function () {
						if ( $(this).hasClass('selected') ) {
							$(this).removeClass('selected');
						}
						else {
							table.$('tr.selected').removeClass('selected');
							$(this).addClass('selected');
						}
					} );
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