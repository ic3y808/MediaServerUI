var controllers = angular.module('controllers-playlist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('playlistController', ['$rootScope', '$scope', '$sce', 'subsonicService', function ($rootScope, $scope, $sce, subsonicService) {
	console.log('playlist-controller')

	var columnDefs = [
		{ headerName: "Id", field: "id", width: 75, suppressSizeToFit: true },
		{ headerName: "#", field: "track", width: 75, suppressSizeToFit: true },
		{ headerName: "Title", field: "title" },
		{ headerName: "Artist", field: "artist" },
		{ headerName: "Album", field: "album" },
		{ headerName: "Title", field: "title" },
		{ headerName: "Genre", field: "genre" },
		{ headerName: "Plays", field: "playCount", width: 75, suppressSizeToFit: true },
	];

	$scope.gridOptions = {
		columnDefs: columnDefs,
		rowData: null,
		rowSelection: 'single',
		//domLayout: 'autoHeight',
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
			var index = _.findIndex($rootScope.tracks, function (track) { return track.id === selectedRow.id })
			$rootScope.loadTrack(index);
			$rootScope.$digest();

		},
		onGridReady: function (event) { $scope.gridOptions.api.setRowData($rootScope.tracks); },
	};



	$rootScope.$on('loginStatusChange', function (event, data) {
		$scope.gridOptions.api.setRowData($rootScope.tracks);
	});

	$rootScope.$on('menuSizeChange', function (event, data) {
		$('#playlistGrid').width($('.content').width());

	});

    $rootScope.$on('windowResized', function (event, data) {

		$('#playlistGrid').width($('.wrapper').width());
		$('#playlistGrid').height($('.wrapper').height());

		$scope.gridOptions.api.doLayout();
		$scope.gridOptions.api.sizeColumnsToFit();
		//$scope.gridOptions.api.setDomLayout('print');
    });

	if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);

