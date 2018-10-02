var controllers = angular.module('controllers-playlist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('playlistController', ['$rootScope', '$scope', '$sce', 'subsonicService', function ($rootScope, $scope, $sce, subsonicService) {
	console.log('playlist-controller')

	var columnDefs = [
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
		enableColResize: true,
		enableSorting: true,
		enableFilter: true,
		rowDeselection: true,
		animateRows: true,
		getRowNodeId: function (data) { return data.id; },
		rowMultiSelectWithClick: true,
		onModelUpdated: function (data) {
			if (data && data.api) {
				data.api.doLayout();
				data.api.sizeColumnsToFit();
			}
		},
		onSelectionChanged: function (data) {
			console.log('selection changed')
			var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];
			var index = _.findIndex($rootScope.tracks, function (track) { return track.id === selectedRow.id })
			$rootScope.loadTrack(index);
			$rootScope.$digest();

		},
		onGridReady: function (event) {
			if ($scope.gridOptions && $scope.gridOptions.api) {
				$scope.gridOptions.api.setRowData($rootScope.tracks);
				$scope.gridOptions.api.doLayout();
				$scope.gridOptions.api.sizeColumnsToFit();
			}
		},
	};



	$rootScope.$on('loginStatusChange', function (event, data) {
		$scope.gridOptions.api.setRowData($rootScope.tracks);
	});

	$rootScope.$on('menuSizeChange', function (event, data) {
		$('#playlistGrid').width($('.wrapper').width());
		$('#playlistGrid').height($('.wrapper').height());
		if ($scope.gridOptions && $scope.gridOptions.api) {
			$scope.gridOptions.api.doLayout();
			$scope.gridOptions.api.sizeColumnsToFit();
		}

	});


	$rootScope.$on('windowResized', function (event, data) {

		$('#playlistGrid').width($('.wrapper').width());
		$('#playlistGrid').height($('.wrapper').height());

		if ($scope.gridOptions && $scope.gridOptions.api) {
			$scope.gridOptions.api.doLayout();
			$scope.gridOptions.api.sizeColumnsToFit();
		}
	});

	if ($rootScope.isMenuCollapsed === true) {
		$('.content').toggleClass('content-wide');
		$('.gridContainer ').toggleClass('dataTable-wide');
	}
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);

