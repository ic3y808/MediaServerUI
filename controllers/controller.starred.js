var controllers = angular.module('controllers-starred', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('starredController', ['$rootScope', '$scope', '$location', 'subsonicService', function ($rootScope, $scope, $location, $sce, subsonicService) {
    console.log('starred-controller')

    var columnDefs = [
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
            if (data && data.api) {
                data.api.doLayout();
                data.api.sizeColumnsToFit();
            }
        },
        onSelectionChanged: function (data) {
            console.log('selection changed')
            var selectedRow = $scope.api.getSelectedRows()[0];
            $rootScope.tracks = $scope.tracks;

            var index = _.findIndex($rootScope.tracks, function (track) { return track.id === selectedRow.id })
            $rootScope.loadTrack(index);
            $rootScope.$digest();

        },
        onGridReady: function (e) {
            $scope.api = e.api;
            $scope.columnApi = e.columnApi;
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
                
                if($scope.gridOptions && $scope.gridOptions.api){
                    $scope.gridOptions.api.setRowData($scope.tracks);
                    $scope.gridOptions.api.doLayout();
                    $scope.gridOptions.api.sizeColumnsToFit();
                }
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

        if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
        }
    });

    $rootScope.$on('windowResized', function (event, data) {

        $('#starredGrid').width($('.wrapper').width());
        $('#starredGrid').height($('.wrapper').height());

        if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
        }
    });


    $scope.reloadStarred();

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
}]);