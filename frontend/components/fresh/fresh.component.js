import './fresh.scss';
import Glide from '@glidejs/glide'
import moment from 'moment'

class FreshController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('fresh-controller');
    $scope.albums = [];
    $scope.tracks = [];
    $scope.last_run = moment();
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
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
        setTimeout(function () {
          $scope.refresh();
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

    $scope.getAlbum = function (id, ) {
      console.log(moment().diff($scope.last_run, 'miliseconds'))
      if (moment().diff($scope.last_run, 'miliseconds') < 250) return;
      $scope.last_run = moment();

      that.AlloyDbService.getAlbum($scope.albums[$scope.glide.index].album_id).then(function (result) {
        if (result) {
          that.$scope.tracks = result.tracks;

          if (that.$scope.gridOptions && that.$scope.gridOptions.api) {
            that.$scope.gridOptions.api.setRowData(that.$scope.tracks);
            that.$scope.gridOptions.api.doLayout();
            that.$scope.gridOptions.api.sizeColumnsToFit();
          }
          that.AppUtilities.apply();
        }
      });
    }

    $scope.refresh = function () {

      $scope.albums = [];
      that.AlloyDbService.getFresh(5).then(function (newestCollection) {
        $scope.albums = newestCollection.albums;
        $scope.albums.forEach(function (album) {
          album.cover_art = that.AlloyDbService.getCoverArt(album.cover_art);
        })

        $scope.glide = new Glide('#intro', {
          type: 'slider',
          perView: 8,
          focusAt: 'center',
          800: {
            perView: 8
          }
        })

        $scope.glide.mount();

        $scope.glide.on(['move.after'], $scope.getAlbum);

        that.AppUtilities.apply();

        //$scope.flip.flipster('index');
        if ($scope.albums && $scope.albums.length > 0) {
          $scope.getAlbum($scope.albums[0].album_id);
        }
        AppUtilities.hideLoader();
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

    $rootScope.$on('playlistEndEvent', function (event, data) {
      if ($scope.continousPlay) {
        $scope.flip.flipster('next');
        setTimeout(function () {
          MediaPlayer.tracks = $scope.tracks;
          MediaPlayer.loadTrack(0);
        }, 500);
      }
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
      that.Backend.debug('Fresh reload on loginsatuschange');
      $scope.refresh();
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