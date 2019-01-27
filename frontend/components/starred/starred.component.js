import './starred.scss';
class StarredController {
  constructor($scope, $rootScope, $timeout, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('starred-controller');
    this.AppUtilities.showLoader();
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
      domLayout: 'autoHeight',
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
          that.MediaPlayer.tracks = $rootScope.starred_tracks;

          var index = _.findIndex(that.MediaPlayer.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          that.MediaPlayer.loadTrack(index);
        }
      }
    };

    $scope.toggleContinousPlay = function () {
      $scope.continousPlay = !$scope.continousPlay;
    };

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.findNowPlaying = function (id) {
      $rootScope.fresh_albums.forEach(function (album) {

      });
    }

    $scope.getAlbum = function (album) {
      that.$scope.tracks = album.tracks;

      if ($scope.play_prev_album) {
        MediaPlayer.tracks = $scope.tracks;
        MediaPlayer.loadTrack($scope.tracks.length - 1);
        $scope.play_prev_album = false;
      }

      if ($scope.play_next_album) {
        MediaPlayer.tracks = $scope.tracks;
        MediaPlayer.loadTrack(0);
        $scope.play_next_album = false;
      }

      that.AppUtilities.setRowData(that.$scope.gridOptions, that.$scope.tracks);
    }

    $scope.refresh = function () {
      AlloyDbService.refreshStarred();
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      MediaPlayer.tracks = AppUtilities.shuffle($rootScope.starred_tracks);
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

    $rootScope.$watch('starred_tracks', function (newVal, oldVal) {
      if ($rootScope.starred_tracks) {
        AppUtilities.setRowData($scope.gridOptions, $rootScope.starred_tracks);
        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
      }
    });

    $rootScope.$watch('starred_albums', function (newVal, oldVal) {
      if ($rootScope.starred_albums) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({
            playlist: $rootScope.starred_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });

            this.on('click', function (index, link) {
              //if ($rootScope.starred_albums && $rootScope.starred_albums.length > 0) {
              //  $scope.getAlbum($rootScope.starred_albums[index]);
              //}
            });
          });
        });
      }

    });

  }

}

export default {
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};