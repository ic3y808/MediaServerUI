class FreshController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('fresh-controller');
    $scope.albums = [];
    $scope.tracks = [];
    $scope.continousPlay = true;

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
      headerName: "Artist",
      field: "artist"
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
        setTimeout(function () {
          $scope.reloadAll();
          $scope.gridOptions.api.sizeColumnsToFit();
          $scope.gridOptions.api.addGlobalListener(
            function (foo) {
              _.debounce(function () {
                $scope.gridOptions.api.sizeColumnsToFit();
              }, 300);
            }
          );
        }, 750);
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

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    }

    $scope.reloadAll = function () {
      if ($rootScope.isLoggedIn) {
        $scope.albums = [];
        $rootScope.subsonic.getAlbumList2("newest").then(function (newestCollection) {
          $scope.albums = newestCollection;
          $scope.albums.forEach(album => {
            if (album.coverArt) {
              $rootScope.subsonic.getCoverArt(album.coverArt, 100).then(function (result) {
                album.artUrl = result;
                if (!$scope.$$phase) {
                  $scope.$apply();
                }
              });
            } else {
              album.artUrl = '/content/no-art.png';
            }
          });

          setTimeout(function () {
            $scope.flip = $("#coverflow").flipster({
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
            if (!$scope.$$phase) {
              $scope.$apply();
            }
            $scope.flip.flipster('index');
            $scope.flip.flipster('next');
            $rootScope.hideLoader();
          }, 750);
        });
      } else {
        if ($scope.gridOptions.api) {
          $scope.gridOptions.api.showNoRowsOverlay();
        }
        $rootScope.hideLoader();
      }
    };

    $scope.startRadio = function () {
      var track = $rootScope.selectedTrack();
      if (!track || !track.artistId) {
        track = $scope.tracks[0];
      }

      $rootScope.subsonic.getSimilarSongs2(track.artistId).then(function (similarSongs) {
        console.log('starting radio');
        if (similarSongs && similarSongs.song) {
          $rootScope.tracks = similarSongs.song;
          $rootScope.loadTrack(0);
        };
      });
    };

    $scope.shuffle = function () {
      console.log('shuffle play');
      $rootScope.tracks = $rootScope.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('playlistEndEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.flip.flipster('next');
        setTimeout(function () {
          $rootScope.tracks = $scope.tracks;
          $rootScope.loadTrack(0);
        }, 500);
      };
    });

    $rootScope.$on('trackChangedEvent', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.redrawRows({
          force: true
        });
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready');
      $scope.reloadAll();
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