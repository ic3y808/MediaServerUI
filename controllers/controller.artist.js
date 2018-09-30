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
        {
            headerName: "#",
            field: "track",
            width: 75,
            suppressSizeToFit: true
        },
        {
            headerName: "Title",
            field: "title"
        },
        {
            headerName: "Album",
            field: "album"
        },
        {
            headerName: "Title",
            field: "title"
        },
        {
            headerName: "Genre",
            field: "genre"
        },
        {
            headerName: "Plays",
            field: "playCount",
            width: 75,
            suppressSizeToFit: true
        },
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
        getRowNodeId: function (data) {
            return data.id;
        },
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

            var index = _.findIndex($rootScope.tracks, function (track) {
                return track.id === selectedRow.id
            })
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
                        $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                        $scope.similarArtists = result.similarArtist.slice(0, 5);
                        $('#mainArtistContent').css('background-image', 'url(' + result.largeImageUrl.replace('300x300', '1280x400') + ')');
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

    $scope.startRadio = function () {
        $rootScope.subsonic.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
            console.log('starting radio')
            $rootScope.tracks = similarSongs.song;
            $rootScope.loadTrack(0);
            $rootScope.$digest();
        });
    };

    $scope.shuffle = function () {
            console.log('shuffle play')
            $rootScope.tracks =_.shuffle($scope.tracks);
            $rootScope.loadTrack(0);
            $rootScope.$digest();
    };

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

    $rootScope.$on('windowResized', function (event, data) {

        $('#tracksGrid').width($('.wrapper').width());
        $('#tracksGrid').height($('.wrapper').height());

        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
        //$scope.gridOptions.api.setDomLayout('print');
    });

    $scope.getArtist();
    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
}]);