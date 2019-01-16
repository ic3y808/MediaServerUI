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
    $scope.albums = [];
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
      onModelUpdated: function (data) {
        //$scope.updateRows();
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
      $scope.albums.forEach(function (album) {

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

      if (that.$scope.gridOptions && that.$scope.gridOptions.api) {
        that.$scope.gridOptions.api.setRowData(that.$scope.tracks);

        $scope.updateRows();
      }
    }

    $scope.findNowPlaying = function () {
      var found = false;
      for (var i = 0; i < $scope.albums.length; i++) {
        if (found) return;
        var album = $scope.albums[i];
        album.tracks.forEach(function (track) {
          if (found) return;
          if (MediaPlayer.checkIfNowPlaying(track)) {
            $scope.coverflow.to(i);
            found = true;
          }
        })
      }
    };

    $scope.updateRows = function () {
      $timeout(function () {
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.redrawRows({
            force: true
          });
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
        }
      });
    }

    $scope.refresh = function () {
      if ($scope.refreshing) return;

      $scope.refreshing = true;

      $scope.albums = [];

      var getFresh = that.AlloyDbService.getFresh(50);

      if (!getFresh) {
        that.$scope.refreshing = false;
        return;
      }
      getFresh.then(function (newestCollection) {
        $scope.albums = newestCollection.albums;
        $scope.albums.forEach(function (album) {
          album.image = that.AlloyDbService.getCoverArt(album.cover_art);
          album.title = album.album;
        });

        that.AppUtilities.apply();
        that.AppUtilities.hideLoader();
        $timeout(function () {
          $scope.coverflow = coverflow('player').setup({
            backgroundcolor: "ffffff",
            playlist: $scope.albums,
            width: '100%',
            coverwidth: 200,
            coverheight: 200,
            fixedsize: true,
          }).on('ready', function () {
            this.on('focus', function (index) {
              if ($scope.albums && $scope.albums.length > 0) {
                $scope.getAlbum($scope.albums[index]);
              }
            });

            this.on('click', function (index, link) {
              if ($scope.albums && $scope.albums.length > 0) {
                $scope.getAlbum($scope.albums[index]);
              }
            });
          });

          if ($scope.albums && $scope.albums.length > 0) {
            $scope.getAlbum($scope.albums[0]);
            $scope.findNowPlaying();
          }

          $scope.refreshing = false;
          console.log('refreshed')
        });
      });
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
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.redrawRows({
          force: true
        });
        $scope.updateRows();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      if (data.isLoggedIn) {
        that.Backend.debug('Fresh reload on loginsatuschange');
        $scope.refresh();
      }
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      //$scope.updateRows();
    });

    $rootScope.$on('windowResized', function (event, data) {
      $scope.updateRows();
    });

    setTimeout(function(){
      $scope.refresh()
    }, 750);
  }
}

export default {
  bindings: {},
  controller: FreshController,
  templateUrl: '/template/fresh.jade'
};