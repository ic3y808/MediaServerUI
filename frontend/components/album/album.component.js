import './album.scss';
class AlbumController {
  constructor($scope, $rootScope, $routeParams, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artist-controller');
    this.AppUtilities.showLoader();
    $scope.album = {};
    $scope.tracks = [];
    $scope.albumName = '';
    $scope.artistName = '';
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
      headerName: "Album",
      field: "album"
    },
    {
      headerName: "Artist",
      field: "artist"
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
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      domLayout: 'autoHeight',
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
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
      }
    };

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.getArtistInfo = function (data) {
      if (data) {
        data.forEach(function (info) {
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
                  //that.AppUtilities.setContentBackground(image['#']);
                }
              });
            }
          }
        });
      }
    };
    $scope.getAlbumInfo = function (data) {
      if (data) {
        data.forEach(function (info) {
          if (info.albumInfo) {
            $scope.albumInfo = info.albumInfo;
            if ($scope.albumInfo.image) {
              $scope.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'extralarge') {
                  //that.AppUtilities.setContentBackground(image['#']);
                }
              });
            }
          }
        });
      }
    };

    $scope.getAlbum = function () {
      var alb = AlloyDbService.getAlbum($routeParams.id);
      if (alb) {
        alb.then(function (album) {
          if (album) {
            $scope.album = album;
            $scope.albumName = album.name;
            $scope.albumArt = $scope.getCoverArt(album.tracks[0].cover_art);
            $scope.artistName = album.base_path;
            $scope.tracks = album.tracks;

            that.AppUtilities.setContentBackground($scope.albumArt);

            var artistInfo = that.AlloyDbService.getArtistInfo($scope.artistName);
            var albumInfo = that.AlloyDbService.getAlbumInfo($scope.artistName, $scope.albumName);

            Promise.all([artistInfo, albumInfo]).then(function (info) {
              $scope.getArtistInfo(info);
              $scope.getAlbumInfo(info);

              if ($scope.tracks && $scope.tracks.length > 0) {
                AppUtilities.setRowData($scope.gridOptions, $scope.tracks);
                if ($routeParams.trackid) {
                  $scope.gridOptions.api.forEachNode(function (node) {
                    if (node.data.id === $routeParams.trackid) {
                      $scope.gridOptions.api.selectNode(node, true);
                    }
                  });
                }
              } else {
                AppUtilities.showNoRows();
              }
              that.AppUtilities.hideLoader();
              that.AppUtilities.apply();
            });
          } else {
            that.AppUtilities.hideLoader();
          }
        });
      }
    };

    $scope.goToArtist = function (id) {
      window.location.href = '/artist/' + id;

    };

    $scope.refresh = function () {
      that.Backend.debug('refresh album');
      $scope.getAlbum();
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

    $scope.shareAlbum = function () {
      that.Backend.debug('shareButton');
      that.AlloyDbService.createShare($scope.album.id, 'Shared from Alloy').then(function (result) {
        $('#shareAlbumButton').popover({
          animation: true,
          content: 'Success! Url Copied to Clipboard.',
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: 'top'
        }).popover('show');
        var url = result.url.toString();
        that.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $('#shareAlbumButton').popover('hide');
        }, 5000);
      });
    };

    $scope.starAlbum = function(){
        that.Backend.info('liking album: ' + that.$scope.album.name);
        if ($scope.album.starred === 'true') {
          that.AlloyDbService.unstar({ album: that.$scope.album.id }).then(function (result) {
            that.Backend.info('UnStarred');
            that.Backend.info(result);
            that.$scope.album.starred = 'false';
            that.AppUtilities.apply();
          });
        } else {
          that.AlloyDbService.star({ album: that.$scope.album.id }).then(function (result) {
            that.Backend.info('starred');
            that.Backend.info(result);
            that.$scope.album.starred = 'true';
            that.AppUtilities.apply();
          });
        }
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Album reload on loginsatuschange');
      $scope.refresh();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('windowResized', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $scope.refresh();
  }
}

export default {
  bindings: {},
  controller: AlbumController,
  templateUrl: '/template/album.jade'
};