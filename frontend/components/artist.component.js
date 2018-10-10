class ArtistController {
  constructor($scope, $rootScope, $routeParams) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('artist-controller')
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';

    var columnDefs = [{
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
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowClassRules: {
        // row style function
        'current-track': function (params) {

          if ($rootScope.selectedTrack()) {
            $scope.api.deselectAll();
            return params.data.id === $rootScope.selectedTrack().id;
          }
          return false;
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: true,
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          $rootScope.tracks = $scope.tracks;

          var index = _.findIndex($rootScope.tracks, function (track) {
            return track.id === selectedRow.id
          })
          $rootScope.loadTrack(index);
          $rootScope.$digest();
        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
        $scope.api.showLoadingOverlay();
      }
    };

    $scope.getArtist = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getArtist($routeParams.id).then(function (artist) {
          $scope.artist = artist;
          $scope.artistName = artist.name;

          $rootScope.subsonic.getArtistInfo2($routeParams.id, 50).then(function (result) {
            if (result) {
              if (result.biography) {
                $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
              }
              if (result.similarArtist) {
                $scope.similarArtists = result.similarArtist.slice(0, 5);
              }
              if (result.largeImageUrl) {
                $('#mainArtistContent').css('background-image', 'url(' + result.largeImageUrl.replace('300x300', '1280x800') + ')');
              }
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

                  if ($scope.gridOptions && $scope.gridOptions.api) {
                    $scope.gridOptions.api.setRowData($scope.tracks);
                    $scope.gridOptions.api.doLayout();
                    $scope.gridOptions.api.sizeColumnsToFit();
                  }
                  $scope.$apply();
                }
              })
            });
          } else {
            $scope.gridOptions.api.showNoRowsOverlay();
          }


          $scope.$apply();
          $(".loader").css("display", "none");
          $(".content").css("display", "block");
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
      $rootScope.tracks = _.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      $scope.api.redrawRows({
        force: true
      });
      if ($scope.gridOptions && $scope.gridOptions.api) {

        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('artist reloading on subsonic ready')
      $scope.getArtist();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {

      $('#artistsGrid').width($('.wrapper').width());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {

      $('#tracksGrid').width($('.wrapper').width());
      $('#tracksGrid').height($('.wrapper').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $scope.getArtist();
    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $(".content").addClass("content-with-toolbar");
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
  }
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
};