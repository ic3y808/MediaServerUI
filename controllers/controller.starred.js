var controllers = angular.module('controllers-starred', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('starredController', ['$rootScope', '$scope', '$location', 'subsonicService', function ($rootScope, $scope, $location, $sce, subsonicService) {
    console.log('starred-controller')

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

    $scope.reloadStarred = function () {
        if ($rootScope.isLoggedIn) {
            $scope.albums = [];
            $scope.tracks = [];
            $rootScope.subsonic.getStarred().then(function (result) {
               
                result.album.forEach(album => {

                    if (album.coverArt) {
                        $rootScope.subsonic.getCoverArt(album.coverArt, 128).then(function (result) {
                            album.artUrl = result;
                            $scope.albums.push(album);
                            $scope.$apply();
                        });
                    }
                });
                $scope.tracks = result.song;
                $scope.gridOptions.api.setRowData($scope.tracks);
                $scope.gridOptions.api.sizeColumnsToFit();
                $scope.$apply();
            }, function (reject) {
                console.log(reject)
            });
        }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
        console.log('starred reloading on subsonic ready')
        $scope.reloadStarred();
    });

    document.addEventListener("DOMContentLoaded", function () {
        var eGridDiv = document.querySelector('#starredGrid');
        new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, data) {

        $('#starredGrid').width($('.wrapper').width());
        $('#starredGrid').height($('.wrapper').height());

        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
        //$scope.gridOptions.api.setDomLayout('print');
    });

    $rootScope.$on('windowResized', function (event, data) {

        $('#starredGrid').width($('.wrapper').width());
        $('#starredGrid').height($('.wrapper').height());

        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
        //$scope.gridOptions.api.setDomLayout('print');
    });


    $scope.reloadStarred();

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
}]);