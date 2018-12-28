import './artist.scss';
class ArtistController {
  constructor($scope, $rootScope, $routeParams, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artist-controller');
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';
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
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
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
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
        // $scope.api.showLoadingOverlay();
      }
    };

    $scope.menuOptions = [
      // NEW IMPLEMENTATION
      {
        text: 'Object-Select',
        click: function ($itemScope, $event, modelValue, text, $li) {
          $scope.selected = $itemScope.item.name;
        }
      },
      {
        text: 'Object-Remove',
        click: function ($itemScope, $event, modelValue, text, $li) {
          $scope.items.splice($itemScope.$index, 1);
        }
      },
      // LEGACY IMPLEMENTATION
      ['Select', function ($itemScope, $event, modelValue, text, $li) {
        $scope.selected = $itemScope.item.name;
      }],
      null, // Dividier
      ['Remove', function ($itemScope, $event, modelValue, text, $li) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];

    $scope.getArtist = function () {

      var artist = that.AlloyDbService.getArtist($routeParams.id);
      if (artist) {
        artist.then(function (artist) {

          $scope.artist = artist;
          $scope.artistName = artist.name;

          $scope.tracks = [];

          artist.tracks.forEach(track => {
            $scope.tracks.push(track);
            //if (album.coverArt) {
            //  that.AlloyDbService.getCoverArt(album.coverArt, 100).then(function (result) {
            //    album.artUrl = result;
            //    $scope.albums.push(album);
            //    that.AppUtilities.apply();
            //    $("#coverflow").flipster();
            //  });
            //}
          });

          if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.setRowData($scope.tracks);
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
          }

          var artistInfo = that.AlloyDbService.getArtistInfo($scope.artistName);
          if (artistInfo) {
            artistInfo.then(function (info) {
              if (info.artistInfo) {
                $scope.artistInfo = info.artistInfo;
                if ($scope.artistInfo.bio) {
                  $scope.artistBio = $scope.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                }
                if ($scope.artistInfo.similar) {
                  $scope.similarArtists = $scope.artistInfo.similar.artist.slice(0, 5);
                }
                if ($scope.artistInfo.image) {
                  $scope.artistInfo.image.forEach(function (image) {
                    if (image['@'].size === 'extralarge') {
                      that.AppUtilities.setContentBackground(image['#']);
                    }
                  });
                }
                that.AppUtilities.apply();
              }
            });
          }

          that.AppUtilities.apply();
          $("#coverflow").flipster();
          AppUtilities.hideLoader();

        });



      }


      //AlloyDbService.getArtist($routeParams.id).then(function (artist) {
      //  $scope.artist = artist;
      //  $scope.artistName = artist.name;
      //
      //  AlloyDbService.getArtistInfo2($routeParams.id, 50).then(function (result) {
      //    if (result) {
      //      if (result.biography) {
      //        $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
      //      }
      //      if (result.similarArtist) {
      //        $scope.similarArtists = result.similarArtist.slice(0, 5);
      //      }
      //      if (result.largeImageUrl) {
      //        that.AppUtilities.setContentBackground(result.largeImageUrl);
      //      }
      //      that.AppUtilities.apply();
      //    }
      //  });
      //
      //  if (artist.album && artist.album.length > 0) {
      //    $scope.albums = [];
      //    $scope.tracks = [];
      //    artist.album.forEach(album => {
      //
      //      if (album.coverArt) {
      //        that.AlloyDbService.getCoverArt(album.coverArt, 100).then(function (result) {
      //          album.artUrl = result;
      //          $scope.albums.push(album);
      //          that.AppUtilities.apply();
      //          $("#coverflow").flipster();
      //        });
      //      }
      //
      //
      //      AlloyDbService.getAlbum(album.id).then(function (result) {
      //        if (result) {
      //          result.song.forEach(function (song) {
      //            $scope.tracks.push(song);
      //            that.AppUtilities.apply();
      //          });
      //
      //          if ($scope.gridOptions && $scope.gridOptions.api) {
      //            $scope.gridOptions.api.setRowData($scope.tracks);
      //            $scope.gridOptions.api.doLayout();
      //            $scope.gridOptions.api.sizeColumnsToFit();
      //          }
      //          that.AppUtilities.apply();
      //          $("#coverflow").flipster();
      //          AppUtilities.hideLoader();
      //        }
      //      });
      //    });
      //  } else {
      //    if ($scope.gridOptions.api)
      //      $scope.gridOptions.api.showNoRowsOverlay();
      //  }
      //
      //  $("#coverflow").flipster();
      //  that.AppUtilities.apply();
      //  AppUtilities.hideLoader();
      //});



    };

    $scope.refresh = function () {
      that.Backend.debug('refresh artist');
      $scope.getArtist();
    };

    $scope.startRadio = function () {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        MediaPlayer.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      that.MediaPlayer.tracks = AppUtilities.shuffle($scope.tracks);
      that.MediaPlayer.loadTrack(0);
    };

    $scope.starArtist = function () {
      that.Backend.info('starring artist: ' + $scope.artist);
      if ($scope.artist.starred === 'true') {
        that.AlloyDbService.unstar({ artist: that.$scope.artist.id }).then(function (result) {
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'false'
          that.AppUtilities.apply();
        });
      } else {
        that.AlloyDbService.star({ artist: that.$scope.artist.id }).then(function (result) {
          that.Backend.info('starred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'true'
          that.AppUtilities.apply();
        });
      }
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
      that.Backend.debug('Artist reload on loginsatuschange');
      $scope.getArtist();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
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

    $scope.getArtist();
  }
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
};