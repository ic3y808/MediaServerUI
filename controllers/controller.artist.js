var controllers = angular.module('controllers-artist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('artistController', ['$rootScope', '$scope', '$routeParams', 'subsonicService', 'DTOptionsBuilder', 'DTColumnBuilder', function ($rootScope, $scope, $routeParams, subsonicService, DTOptionsBuilder, DTColumnBuilder) {
	console.log('artist-controller')
	$scope.artist = {};
	$scope.albums = [];
	$scope.tracks = [];
	$scope.artistName = '';

	$scope.dtInstance = {};	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');

	$scope.getArtist = function () {
		if ($rootScope.isLoggedIn) {
			$rootScope.subsonic.getArtist($routeParams.id).then(function (artist) {
				$scope.artist = artist;
				$scope.artistName = artist.name;
				
				if (artist.album && artist.album.length > 0) {
					$scope.albums = [];
					$scope.tracks = [];
					artist.album.forEach(album => {
						
						$rootScope.subsonic.getCoverArt(album.coverArt, 128).then(function (result) {
							album.artUrl = result;
							$scope.albums.push(album);
							$scope.$apply();	
						})

						$rootScope.subsonic.getAlbum(album.id).then(function (result) {
							if(result){
								result.song.forEach(function(song){
									$scope.tracks.push(song);
									console.log(song)
									$scope.$apply();
								});
							}									
						})					
					});
				}

				$rootScope.subsonic.getCoverArt($scope.artist.coverArt, 128).then(function (result) {
					$('#artistCoverImage').attr('src', result);
					$scope.$apply();
				})
				$scope.$apply();
				$(".loader").css("display", "none");
				$(".content").css("display", "block");
				console.log(artist);
			});
		}
	}

	$rootScope.$on('loginStatusChange', function (event, data) {
		console.log('artist reloading on subsonic ready')
		$scope.getArtist();
	});

	$scope.getArtist();
}]);