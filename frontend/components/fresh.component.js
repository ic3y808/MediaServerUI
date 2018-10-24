class FreshController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('fresh-controller');
    $scope.albums = [];

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
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
        console.log("onGridReady");
        $scope.reloadAll();
        $scope.gridOptions.api.sizeColumnsToFit();
        $scope.gridOptions.api.addGlobalListener(
          function (foo) {
            _.debounce(function () {
              $scope.gridOptions.api.sizeColumnsToFit();
            }, 300);

          }
        );
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          $rootScope.tracks = $scope.tracks;

          var index = _.findIndex($rootScope.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          $rootScope.loadTrack(index);
          $rootScope.$digest();
        }
      },
    };

    $scope.reloadAll = function () {
      if ($rootScope.isLoggedIn) {
        $scope.artists = [];
        $rootScope.subsonic.getAlbumList2("newest").then(function (newestCollection) {

          $scope.albums = newestCollection;
          $scope.$apply();


          $rootScope.hideLoader();
          $scope.albums.forEach(album => {
            if (album.coverArt) {
              $rootScope.subsonic.getCoverArt(album.coverArt, 100).then(function (result) {
                album.artUrl = result;
                $scope.$apply();
              });
            }
          });
          console.log($scope.albums);
          setTimeout(function () {
            var flip = $("#coverflow").flipster({
              start: 0,
              fadeIn: 500,
              autoplay: false,
              style: 'coverflow',
              spacing: -0.6,
              onItemSwitch: function (currentItem, previousItem) {
                var id = currentItem.dataset.flipTitle;
                $rootScope.subsonic.getAlbum(id).then(function (result) {
                  if (result) {
                    $scope.tracks = [];
                    result.song.forEach(function (song) {
                      $scope.tracks.push(song);
                    });
                    if ($scope.gridOptions && $scope.gridOptions.api) {
                      $scope.gridOptions.api.setRowData($scope.tracks);
                      $scope.gridOptions.api.doLayout();
                      $scope.gridOptions.api.sizeColumnsToFit();
                    }
                    if (!$scope.$$phase) {
                      $scope.$apply();
                    }
                  }
                });
              }
            });
            flip.flipster('index');
          }, 750);
        });
      } else {
        if ($scope.gridOptions.api) {
          $scope.gridOptions.api.showNoRowsOverlay();
        }
        $rootScope.hideLoader();
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready');
      $scope.reloadAll();
    });

    document.addEventListener("DOMContentLoaded", function () {
      var eGridDiv = document.querySelector('#artistsGrid');
      new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });
  }
}

export default {
  bindings: {},
  controller: FreshController,
  templateUrl: '/template/fresh.jade'
};