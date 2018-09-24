var controllers = angular.module('controllers-artist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('artistController', ['$rootScope', '$scope', '$routeParams', 'subsonicService', function ($rootScope, $scope, $routeParams, subsonicService) {
	console.log('artist-controller')
	$scope.artist = {};
	$scope.albums = [];
	$scope.tracks = [];
	$scope.artistName = '';

	var columnDefs = [
		{ headerName: '', width: 30, suppressSizeToFit: true, checkboxSelection: true, suppressSorting: true, suppressMenu: true, pinned: true },
		{ headerName: "Id", field: "id", width: 75, suppressSizeToFit: true },
		{ headerName: "Title", field: "title" }
	];

	$scope.gridOptions = {
		columnDefs: columnDefs,
		rowData: null,
		rowSelection: 'multiple',
		domLayout: 'autoHeight',
		enableColResize: true,
		enableSorting: true,
		enableFilter: true,
		rowDeselection: true,
		animateRows: true,
		getRowNodeId: function (data) { return data.id; },
		rowMultiSelectWithClick: true,
		onModelUpdated: function (data) {
			
			var model = $scope.gridOptions.api.getModel();
			if($scope.gridOptions.rowData != null){
				var totalRows = $scope.gridOptions.rowData.length;
				var processedRows = model.getRowCount();
				$scope.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
				console.log('onModelUpdated ' + $scope.rowCount)
			}
			
		},
		onSelectionChanged: function (data) {
			console.log('selection changed')
			var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];
			
			//$location.path("/artist/" + selectedRow.id.toString());
			//$scope.$apply();

			$rootScope.subsonic.streamUrl(selectedRow.id).then(function(result){
				$rootScope.config.sources.push({
					src: $sce.trustAsResourceUrl(result),
					type: 'audio/mp3'
				});
				$rootScope.$digest();
			});
			

		}
	};

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
				
								$scope.gridOptions.api.setRowData($scope.tracks);
								$scope.gridOptions.api.sizeColumnsToFit();
								$scope.$apply();
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
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);