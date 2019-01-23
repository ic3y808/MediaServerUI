import './starred.scss';
class StarredController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
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
        AppUtilities.updateGridRows($scope.gridOptions);
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
          $scope.refresh();
          AppUtilities.updateGridRows($scope.gridOptions);
        }, 750);
      },
    };

    $scope.refresh = function () {
      $scope.albums = [];
      $scope.tracks = [];
      var starred = that.AlloyDbService.getStarred();
      if (starred) {
        that.AlloyDbService.getStarred().then(function (result) {
          if (result.albums) {
            result.albums.forEach(album => {

              if (album.coverArt) {
                album.artUrl = that.AlloyDbService.getCoverArt(album.cover_art);
                $scope.albums.push(album);
              }
            });
          }

          $scope.tracks = result.tracks;
          AppUtilities.setRowData($scope.gridOptions, $scope.tracks);
          setTimeout(function () {
            $scope.flip = $("#coverflow").flipster({
              start: 0,
              fadeIn: 500,
              autoplay: false,
              style: 'coverflow',
              spacing: -0.6,
              onItemSwitch: function (currentItem, previousItem) {
                var id = currentItem.dataset.flipTitle;
                that.AlloyDbService.getAlbum(id).then(function (result) {
                  if (result) {
                    $scope.tracks = [];
                    result.song.forEach(function (song) {
                      $scope.tracks.push(song);
                    });
                    that.AppUtilities.setRowData(that.$scope.gridOptions, that.$scope.tracks);
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
        AppUtilities.updateGridRows($scope.gridOptions);
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Starred reload on loginsatuschange');
      $scope.refresh();
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        AppUtilities.updateGridRows($scope.gridOptions);
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      if ($scope.gridOptions && $scope.gridOptions.api) {
        AppUtilities.updateGridRows($scope.gridOptions);
      }
    });

    $scope.refresh();
  }
}

export default {
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};