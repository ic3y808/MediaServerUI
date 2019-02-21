import CryptoJS from 'crypto-js';
import AlloyApi from '../API/alloy.db'
export default class AlloyDbService {
  constructor($rootScope, Logger, AppUtilities) {
    "ngInject";
    this.isLoggingIn = true;
    this.isLoggedIn = false;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;

  }

  doLogin() {
    if (this.$rootScope.settings && this.$rootScope.settings.alloydb && this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
      if (!this.isLoggedIn) {
        this.Logger.info('logging into alloydb')

        this.alloydb = new AlloyApi(this.$rootScope.settings.alloydb);

        this.alloydb.ping().then(result => {
          if (result) {
            if (result.status == 'success') {
              this.isLoggedIn = true;
              this.isLoggingIn = false;
              this.preload();
            } else {
              this.isLoggingIn = false;
              this.isLoggedIn = false;
            }
            this.Logger.info('logging into alloydb is ' + JSON.stringify(result));
          }

          this.AppUtilities.broadcast('loginStatusChange', { service: 'alloydb', isLoggedIn: this.isLoggedIn });
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

  getArtists() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtists();
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

  getCoverArt(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getCoverArt(params);
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
    
    if (data) {
      data.forEach(info => {
        if (info.artists) {
          this.$rootScope.artists = info.artists;
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadFresh(data) {
    
    if (data) {
      data.forEach(info => {
        if (info.fresh && info.fresh.albums) {
          this.$rootScope.fresh_albums = info.fresh.albums;
          //this.$rootScope.fresh_albums.forEach(album => {
          //  album.image = this.getCoverArt(album.cover_art);
          //  album.title = album.album;
          //});
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadAlbums(data) {
    
    if (data) {
      data.forEach(info=> {
        if (info.albums) {
          this.$rootScope.albums = info.albums;
          //this.$rootScope.albums.forEach(album =>  {
          //  album.image = this.getCoverArt(album.cover_art);
          //  album.title = album.album;
          //});
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadGenres(data) {
    
    if (data) {
      data.forEach(info=> {
        if (info.genres) {
          this.$rootScope.genres = info.genres;
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadStarred(data) {
    
    if (data) {
      data.forEach(info=> {
        if (info.starred) {
          this.$rootScope.starred_tracks = info.starred.tracks;
          this.$rootScope.starred_albums = info.starred.albums;
          this.$rootScope.starred_albums.forEach(album=> {
            album.image = this.getCoverArt(album.cover_art);
            album.title = album.album;
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadIndex(data) {
    
    if (data) {
      data.forEach(info=> {
        if (info.index) {
          this.$rootScope.music_index = info.index;
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadRandom(data) {
    
    if (data) {
      data.forEach(info=>{
        if (info.random) {
          this.$rootScope.random = info.random;
          //this.$rootScope.random.forEach(track=> {
          //  track.image = this.getCoverArt(track.cover_art);
          //});
          this.AppUtilities.apply();
        }
      });
    }
  }

  refreshArtists() {
    
    var artists = this.getArtists();
    if (artists) {
      artists.then(info=>{
        this.loadArtists([info]);
      })
    }
  };

  refreshFresh() {
    
    var fresh = this.getFresh(50);
    if (fresh) {
      fresh.then(info=>{
        this.loadFresh([info]);
      })
    }
  }

  refreshAlbums() {
    
    var albums = this.getAlbums();
    if (albums) {
      albums.then(info=>{
        this.loadAlbums([info]);
      })
    }
  }

  refreshGenres() {
    
    var genres = this.getGenres();
    if (genres) {
      genres.then(info=>{
        this.loadGenres([info]);
      })
    }
  }

  refreshStarred() {
    
    var starred = this.getStarred();
    if (starred) {
      starred.then(info=>{
        this.loadStarred([info]);
      })
    }
  }

  refreshIndex() {
    
    var index = this.getMusicFoldersIndex();
    if (index) {
      index.then(info=>{
        this.loadIndex([info]);
      })
    }
  }

  refreshRandom() {
    
    var random = this.getRandomSongs();
    if (random) {
      random.then(info=>{
        this.loadRandom([info]);
      })
    }
  }

  preload() {
    
    var artists = this.getArtists();
    var fresh = this.getFresh(50);
    var albums = this.getAlbums();
    var genres = this.getGenres();
    var starred = this.getStarred();
   // var index = this.getMusicFoldersIndex();
    var random = this.getRandomSongs();

    Promise.all([artists, fresh, albums, genres, starred, random]).then(info=>{
      if(info){
        this.loadArtists(info);
        this.loadFresh(info);
        this.loadAlbums(info);
        this.loadGenres(info);
        this.loadStarred(info);
        this.loadIndex(info);
        this.loadRandom(info);
        this.AppUtilities.apply();
      }
    });
  }
}

