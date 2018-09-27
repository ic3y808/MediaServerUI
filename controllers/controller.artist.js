var controllers = angular.module('controllers-artist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('artistController', ['$rootScope', '$scope', '$routeParams', '$sce', 'subsonicService', function ($rootScope, $scope, $routeParams, $sce, subsonicService) {
	console.log('artist-controller')
	$scope.artist = {};
	$scope.albums = [];
	$scope.tracks = [];
	$scope.artistName = '';

	var columnDefs = [
		{ headerName: '', width: 30, suppressSizeToFit: true, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true },
		{ headerName: "Id", field: "id", width: 75, suppressSizeToFit: true },
		{ headerName: "#", field: "track", width: 75, suppressSizeToFit: true },
		{ headerName: "Title", field: "title" },
		{ headerName: "Album", field: "album" },
		{ headerName: "Title", field: "title" },
		{ headerName: "Genre", field: "genre" },
		{ headerName: "Plays", field: "playCount", width: 75, suppressSizeToFit: true },
	];

	$scope.gridOptions = {
		columnDefs: columnDefs,
		rowData: null,
		rowSelection: 'single',
	//	domLayout: 'autoHeight',
		enableColResize: true,
		enableSorting: true,
		enableFilter: true,
		rowDeselection: true,
		animateRows: true,
		getRowNodeId: function (data) { return data.id; },
		rowMultiSelectWithClick: true,
		onModelUpdated: function (data) {

			var model = $scope.gridOptions.api.getModel();
			if ($scope.gridOptions.rowData != null) {
				var totalRows = $scope.gridOptions.rowData.length;
				var processedRows = model.getRowCount();
				$scope.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
				console.log('onModelUpdated ' + $scope.rowCount)
			}

		},
		onSelectionChanged: function (data) {
			console.log('selection changed')
			var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];
			$rootScope.tracks = $scope.tracks;

			var index = _.findIndex($rootScope.tracks, function (track) { return track.id === selectedRow.id })
			$rootScope.loadTrack(index);
			$rootScope.$digest();

		}
	};

	$scope.getArtist = function () {
		if ($rootScope.isLoggedIn) {
			$rootScope.subsonic.getArtist($routeParams.id).then(function (artist) {
				$scope.artist = artist;
				$scope.artistName = artist.name;
				

				$rootScope.subsonic.getArtistInfo2($routeParams.id, 50).then(function (result) {
					console.log("getArtistDetails result")
					console.log(result)

					if (result) {
						$scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i,"");
						$('#mainArtistContent').css('background-image', 'url(' + result.largeImageUrl + ')');
						$scope.$apply();
					}
				});

				if (artist.album && artist.album.length > 0) {
					$scope.albums = [];
					$scope.tracks = [];
					artist.album.forEach(album => {

						if (album.coverArt) {
							$rootScope.subsonic.getCoverArt(album.coverArt, 128).then(function (result) {
								album.artUrl = result;
								$scope.albums.push(album);
								$scope.$apply();
							});
						}


						$rootScope.subsonic.getAlbum(album.id).then(function (result) {
							if (result) {
								result.song.forEach(function (song) {
									$scope.tracks.push(song);
									$scope.$apply();
								});

								$scope.gridOptions.api.setRowData($scope.tracks);
								$scope.gridOptions.api.sizeColumnsToFit();
								$scope.gridOptions.api.setDomLayout('print');

								$scope.$apply();
							}
						})
					});
				}

				
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

	$rootScope.$on('menuSizeChange', function (event, data) {

		$('#artistsGrid').width($('.content').width());

		$scope.gridOptions.api.doLayout();
		$scope.gridOptions.api.sizeColumnsToFit();
		//$scope.gridOptions.api.setDomLayout('print');
	});

	$(window).on('resize', function () {
		
		_.debounce(function () {
			$('.ag-root-wrapper-body').width($('.ag-root-wrapper').width())

			//$scope.gridOptions.api.doLayout();
			$scope.gridOptions.api.sizeColumnsToFit();
			//$scope.gridOptions.api.setDomLayout('print');
		}, 300);
	});

	$scope.getArtist();
	if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);