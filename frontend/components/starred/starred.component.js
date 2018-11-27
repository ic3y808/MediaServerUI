import './starred.scss';
class StarredController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('starred-controller');
    var that = this;
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
          if ($scope.gridOptions.api) $scope.gridOptions.api.deselectAll();
          return MediaPlayer.checkIfNowPlaying(params.data);
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
          that.MediaPlayer.tracks = $scope.tracks;

          var index = _.findIndex(that.MediaPlayer.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          that.MediaPlayer.loadTrack(index);
        }
      },
      onGridReady: function () {
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
    };

    $scope.reloadAll = function () {
      if (that.SubsonicService.isLoggedIn) {
        $scope.albums = [];
        $scope.tracks = [];
        that.SubsonicService.subsonic.getStarred().then(function (result) {
          if(result.album){
            result.album.forEach(album => {

              if (album.coverArt) {
                that.SubsonicService.subsonic.getCoverArt(album.coverArt, 128).then(function (result) {
                  album.artUrl = result;
                  $scope.albums.push(album);
                });
              }
            });
          }
          
          $scope.tracks = result.song;
          $scope.gridOptions.api.setRowData($scope.tracks);
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
          setTimeout(function () {
            $scope.flip = $("#coverflow").flipster({
              start: 0,
              fadeIn: 500,
              autoplay: false,
              style: 'coverflow',
              spacing: -0.6,
              onItemSwitch: function (currentItem, previousItem) {
                var id = currentItem.dataset.flipTitle;
                that.SubsonicService.subsonic.getAlbum(id).then(function (result) {
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
                    that.AppUtilities.apply();
                  }
                });
              }
            });
            that.AppUtilities.apply();
            $('#starredAlbums').show();
            $scope.flip.flipster('index');

            AppUtilities.hideLoader();
          }, 750);


        }, function (reject) {
          that.Backend.error(reject);
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        that.AppUtilities.hideLoader();
      }
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      MediaPlayer.tracks = AppUtilities.shuffle($scope.tracks);
      MediaPlayer.loadTrack(0);
    };

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
      that.Backend.debug('music reloading on subsonic ready');
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
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};