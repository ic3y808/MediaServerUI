import './fresh.scss';

class FreshController {
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
    this.Backend.debug('fresh-controller');
    this.AppUtilities.showLoader();

    $scope.refreshing = false;

    $scope.tracks = [];

    $scope.continousPlay = true;

    var that = this;
    var columnDefs = [{
      headerName: "#",
      field: "no",
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
      field: "play_count",
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
      onGridReady: function (params) {
        console.log('grid ready')

        that.$timeout(function () {
          $scope.refresh();
        });
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          MediaPlayer.tracks = $scope.tracks;
          var index = _.findIndex(MediaPlayer.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          MediaPlayer.loadTrack(index);
        }
      },
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

    $scope.findNowPlaying = function () {
      var found = false;
      for (var i = 0; i < $rootScope.fresh_albums.length; i++) {
        if (found) return;
        var album = $rootScope.fresh_albums[i];
        album.tracks.forEach(function (track) {
          if (found) return;
          if (MediaPlayer.checkIfNowPlaying(track)) {
            $scope.coverflow.to(i);
            found = true;
          }
        })
      }
    };



    $scope.refresh = function () {
      if ($scope.refreshing) return;

      $scope.refreshing = true;

      //var getFresh = that.AlloyDbService.getFresh(50);

      //if (!getFresh) {
      //  that.$scope.refreshing = false;
      //   return;
      //}
      // getFresh.then(function (newestCollection) {
      
    };

    $scope.startRadio = function () {
      var track = that.MediaPlayer.selectedTrack();
      if (!track || !track.artistId) {
        track = $scope.tracks[0];
      }

      AlloyDbService.getSimilarSongs2(track.artistId).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        if (similarSongs && similarSongs.song) {
          MediaPlayer.tracks = similarSongs.song;
          MediaPlayer.loadTrack(0);
        }
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      MediaPlayer.tracks = AppUtilities.shuffle($scope.tracks);
      MediaPlayer.loadTrack(0);
    };

    $rootScope.$on('playlistBeginEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.play_prev_album = true;
        $scope.coverflow.prev();
      }
    });

    $rootScope.$on('playlistEndEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.play_next_album = true;
        $scope.coverflow.next();
      }
    });

    $rootScope.$on('trackChangedEvent', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      if (data.isLoggedIn) {
        that.Backend.debug('Fresh reload on loginsatuschange');
        $scope.refresh();
      }
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      //$scope.updateGridRows();
    });

    $rootScope.$on('windowResized', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$watch('fresh_albums', function (newVal, oldVal) {
      if ($rootScope.fresh_albums) {

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({

            playlist: $rootScope.fresh_albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {
              if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
                $scope.getAlbum($rootScope.fresh_albums[index]);
              }
            });

            this.on('click', function (index, link) {
              if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
                $scope.getAlbum($rootScope.fresh_albums[index]);
              }
            });
          });

          if ($rootScope.fresh_albums && $rootScope.fresh_albums.length > 0) {
            $scope.getAlbum($rootScope.fresh_albums[0]);
            $scope.findNowPlaying();
          }

          $scope.refreshing = false;
          console.log('refreshed')
        });
      }

    });
  }
}

export default {
  bindings: {},
  controller: FreshController,
  templateUrl: '/template/fresh.jade'
};