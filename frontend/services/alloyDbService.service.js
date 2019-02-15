import CryptoJS from 'crypto-js';

export default class AlloyDbService {
  constructor($rootScope, Logger, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }

  doLogin() {
    var that = this;

    if (this.$rootScope.settings && this.$rootScope.settings.alloydb && this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
      if (!this.isLoggedIn) {
        this.Logger.info('logging into alloydb')

        this.alloydb = new AlloyApi(this.$rootScope.settings.alloydb);

        this.alloydb.ping().then(function (result) {
          if (result) {
            if (result.status == 'success') {
              that.isLoggedIn = true;
              that.isLoggingIn = false;
              that.preload();
            } else {
              that.isLoggingIn = false;
              that.isLoggedIn = false;
            }
            that.Logger.info('logging into alloydb is ' + JSON.stringify(result));
          }

          that.AppUtilities.broadcast('loginStatusChange', { service: 'alloydb', isLoggedIn: that.isLoggedIn });
        });


      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.ping();
    else return false;
  }

  getSchedulerStatus() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getSchedulerStatus();
    else return false;
  }

  getLibraryInfo() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getLibraryInfo();
    else return false;
  }

  getFileList(path) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getFileList(path);
    else return false;
  }

  getFileParent(path) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getFileParent(path);
    else return false;
  }

  getMediaPaths() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMediaPaths();
    else return false;
  }

  addMediaPath(mediaPath) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.addMediaPath(mediaPath);
    else return false;
  }

  removeMediaPath(mediaPath) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.removeMediaPath(mediaPath);
    else return false;
  }

  getMusicFolders() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMusicFolders();
    else return false;
  }

  getMusicFoldersIndex() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMusicFoldersIndex();
    else return false;
  }

  getRandomSongs() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getRandomSongs();
    else return false;
  }

  getFresh(limit) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getFresh(limit);
    else return false;
  }

  getAlbums() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbums();
    else return false;
  }

  getAlbum(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbum(id);
    else return false;
  }

  getGenre(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenre(id);
    else return false;
  }

  getGenres() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenres();
    else return false;
  }

  getSongsByGenre(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getSongsByGenre(id);
    else return false;
  }

  getArtist(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtist(id);
    else return false;
  }

  getArtistInfo(artist) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtistInfo(artist);
    else return false;
  }

  getAlbumInfo(artist, album) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbumInfo(artist, album);
    else return false;
  }

  getTrackInfo(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getTrackInfo(id);
    else return false;
  }

  getGenreInfo(genre) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenreInfo(genre);
    else return false;
  }

  getStarred() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getStarred();
    else return false;
  }

  scanFullStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanFullStart();
    else return false;
  }

  scanQuickStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanQuickStart();
    else return false;
  }

  scanStatus() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanStatus();
    else return false;
  }

  scanCancel() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanCancel();
    else return false;
  }

  search(query) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.search(query);
    else return false;
  }

  addPlay(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.addPlay(id);
    else return false;
  }

  love(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.love(params);
    else return false;
  }

  unlove(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unlove(params);
    else return false;
  }

  star(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.star(params);
    else return false;
  }

  unstar(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unstar(params);
    else return false;
  }

  stream(id, quality) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.stream(id, quality);
    else return false;
  }

  download(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.download(id);
    else return false;
  }

  getCoverArt(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getCoverArt(id);
    else return false;
  }

  scrobble(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scrobble(id);
    else return false;
  }

  scrobbleNowPlaying(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scrobbleNowPlaying(id);
    else return false;
  }

  loadArtists(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.artists) {
          that.$rootScope.artists = info.artists;
          that.AppUtilities.apply();
        }
      });
    }
  }

  loadFresh(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.fresh && info.fresh.albums) {
          that.$rootScope.fresh_albums = info.fresh.albums;
          that.$rootScope.fresh_albums.forEach(function (album) {
            album.image = that.getCoverArt(album.cover_art);
            album.title = album.album;
          });
          that.AppUtilities.apply();
        }
      });
    }
  }

  loadAlbums(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.albums) {
          that.$rootScope.albums = info.albums;
          that.$rootScope.albums.forEach(function (album) {
            album.image = that.getCoverArt(album.cover_art);
            album.title = album.album;
          });
          that.AppUtilities.apply();
        }
      });
    }
  }

  loadGenres(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.genres) {
          that.$rootScope.genres = info.genres;
          that.AppUtilities.apply();
        }
      });
    }
  }

  loadStarred(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.starred) {
          that.$rootScope.starred_tracks = info.starred.tracks;
          that.$rootScope.starred_albums = info.starred.albums;
          that.$rootScope.starred_albums.forEach(function (album) {
            album.image = that.getCoverArt(album.cover_art);
            album.title = album.album;
          });
          that.AppUtilities.apply();
        }
      });
    }
  }

  loadIndex(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.index) {
          that.$rootScope.music_index = info.index;
          that.AppUtilities.apply();
        }
      });
    }
  }

  loadRandom(data) {
    var that = this;
    if (data) {
      data.forEach(function (info) {
        if (info.random) {
          that.$rootScope.random = info.random;
          that.$rootScope.random.forEach(function (track) {
            track.image = that.getCoverArt(track.cover_art);
          });
          that.AppUtilities.apply();
        }
      });
    }
  }

  refreshArtists() {
    var that = this;
    var artists = this.getMusicFolders();
    if (artists) {
      artists.then(function (info) {
        that.loadArtists([info]);
      })
    }
  };

  refreshFresh() {
    var that = this;
    var fresh = this.getFresh(50);
    if (fresh) {
      fresh.then(function (info) {
        that.loadFresh([info]);
      })
    }
  }

  refreshAlbums() {
    var that = this;
    var albums = this.getAlbums();
    if (albums) {
      albums.then(function (info) {
        that.loadAlbums([info]);
      })
    }
  }

  refreshGenres() {
    var that = this;
    var genres = this.getGenres();
    if (genres) {
      genres.then(function (info) {
        that.loadGenres([info]);
      })
    }
  }

  refreshStarred() {
    var that = this;
    var starred = this.getStarred();
    if (starred) {
      starred.then(function (info) {
        that.loadStarred([info]);
      })
    }
  }

  refreshIndex() {
    var that = this;
    var index = this.getMusicFoldersIndex();
    if (index) {
      index.then(function (info) {
        that.loadIndex([info]);
      })
    }
  }

  refreshRandom() {
    var that = this;
    var random = this.getRandomSongs();
    if (random) {
      random.then(function (info) {
        that.loadRandom([info]);
      })
    }
  }

  preload() {
    var that = this;
    var artists = this.getMusicFolders();
    var fresh = this.getFresh(50);
    var albums = this.getAlbums();
    var genres = this.getGenres();
    var starred = this.getStarred();
    var index = this.getMusicFoldersIndex();
    var random = this.getRandomSongs();

    Promise.all([artists, fresh, albums, genres, starred, index, random]).then(function (info) {
      that.loadArtists(info);
      that.loadFresh(info);
      that.loadAlbums(info);
      that.loadGenres(info);
      that.loadStarred(info);
      that.loadIndex(info);
      that.loadRandom(info);
      that.AppUtilities.apply();
    });
  }
}