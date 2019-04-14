<<<<<<< HEAD
import CryptoJS from "crypto-js";
=======
>>>>>>> master
import AlloyApi from "../API/alloy.db";
export default class AlloyDbService {
  constructor($rootScope, Logger, AppUtilities, $routeParams) {
    "ngInject";
    this.isLoggingIn = true;
    this.isLoggedIn = false;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.$rootScope.refreshPage = this.refreshPage;
  }

  doLogin() {
    if (this.$rootScope.settings && this.$rootScope.settings.alloydb && this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
      if (!this.isLoggedIn) {
        this.Logger.info("logging into alloydb");

        this.alloydb = new AlloyApi(this.$rootScope.settings.alloydb);

        this.alloydb.ping().then((result) => {
          if (result) {
            if (result.status === "success") {
              this.isLoggedIn = true;
              this.isLoggingIn = false;
              this.preload();
            } else {
              this.isLoggingIn = false;
              this.isLoggedIn = false;
            }
            this.Logger.info("logging into alloydb is " + JSON.stringify(result));
          }

          this.AppUtilities.broadcast("loginStatusChange", {
            service: "alloydb",
            isLoggedIn: this.isLoggedIn
          });
        });


      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.ping(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.ping();}
    else {return false;}
>>>>>>> master
  }

  getSchedulerStatus() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getSchedulerStatus(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getSchedulerStatus();}
    else {return false;}
>>>>>>> master
  }

  getLibraryInfo() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getLibraryInfo(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getLibraryInfo();}
    else {return false;}
>>>>>>> master
  }

  getFileList(path) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getFileList(path); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getFileList(path);}
    else {return false;}
>>>>>>> master
  }

  getFileParent(path) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getFileParent(path); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getFileParent(path);}
    else {return false;}
>>>>>>> master
  }

  getMediaPaths() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getMediaPaths(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getMediaPaths();}
    else {return false;}
>>>>>>> master
  }

  addMediaPath(mediaPath) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.addMediaPath(mediaPath); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.addMediaPath(mediaPath);}
    else {return false;}
>>>>>>> master
  }

  removeMediaPath(mediaPath) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.removeMediaPath(mediaPath); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.removeMediaPath(mediaPath);}
    else {return false;}
>>>>>>> master
  }

  getArtistsIndex() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getArtistsIndex(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getArtistsIndex();}
    else {return false;}
>>>>>>> master
  }

  getRandomSongs() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getRandomSongs(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getRandomSongs();}
    else {return false;}
>>>>>>> master
  }

  getFresh(limit) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getFresh(limit); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getFresh(limit);}
    else {return false;}
>>>>>>> master
  }

  getArtists() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getArtists(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getArtists();}
    else {return false;}
>>>>>>> master
  }

  getAlbums() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getAlbums(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getAlbums();}
    else {return false;}
>>>>>>> master
  }

  getAlbum(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getAlbum(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getAlbum(id);}
    else {return false;}
>>>>>>> master
  }

  getGenre(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getGenre(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getGenre(id);}
    else {return false;}
>>>>>>> master
  }

  getGenres() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getGenres(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getGenres();}
    else {return false;}
>>>>>>> master
  }

  getArtist(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getArtist(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getArtist(id);}
    else {return false;}
>>>>>>> master
  }

  getArtistInfo(artist) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getArtistInfo(artist); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getArtistInfo(artist);}
    else {return false;}
>>>>>>> master
  }

  getAlbumInfo(artist, album) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getAlbumInfo(artist, album); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getAlbumInfo(artist, album);}
    else {return false;}
>>>>>>> master
  }

  getTrackInfo(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getTrackInfo(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getTrackInfo(id);}
    else {return false;}
>>>>>>> master
  }

  getGenreInfo(genre) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getGenreInfo(genre); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getGenreInfo(genre);}
    else {return false;}
>>>>>>> master
  }

  getStarred() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getStarred(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getStarred();}
    else {return false;}
>>>>>>> master
  }

  getHistory() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getHistory(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getHistory();}
    else {return false;}
>>>>>>> master
  }

  scanStart() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.scanStart(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.scanStart();}
    else {return false;}
>>>>>>> master
  }

  scanStatus() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.scanStatus(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.scanStatus();}
    else {return false;}
>>>>>>> master
  }

  scanCancel() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.scanCancel(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.scanCancel();}
    else {return false;}
>>>>>>> master
  }

  backup() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.backup(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.backup();}
    else {return false;}
>>>>>>> master
  }

  restore(data) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.restore(data); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.restore(data);}
    else {return false;}
>>>>>>> master
  }

  getCharts() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getCharts(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getCharts();}
    else {return false;}
>>>>>>> master
  }

  search(query) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.search(query); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.search(query);}
    else {return false;}
>>>>>>> master
  }

  addPlay(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.addPlay(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.addPlay(id);}
    else {return false;}
>>>>>>> master
  }

  addHistory(data) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.addHistory(data); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.addHistory(data);}
    else {return false;}
>>>>>>> master
  }

  getPlaylist(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getPlaylist(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getPlaylist(id);}
    else {return false;}
>>>>>>> master
  }

  getPlaylists() {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getPlaylists(); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getPlaylists();}
    else {return false;}
>>>>>>> master
  }

  addPlaylist(data) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.addPlaylist(data); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.addPlaylist(data);}
    else {return false;}
>>>>>>> master
  }

  updatePlaylist(data) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.updatePlaylist(data); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.updatePlaylist(data);}
    else {return false;}
>>>>>>> master
  }

  removePlaylist(data) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.removePlaylist(data); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.removePlaylist(data);}
    else {return false;}
>>>>>>> master
  }

  love(params) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.love(params); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.love(params);}
    else {return false;}
>>>>>>> master
  }

  unlove(params) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.unlove(params); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.unlove(params);}
    else {return false;}
>>>>>>> master
  }

  star(params) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.star(params); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.star(params);}
    else {return false;}
>>>>>>> master
  }

  unstar(params) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.unstar(params); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.unstar(params);}
    else {return false;}
>>>>>>> master
  }

  setRating(params) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.setRating(params); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.setRating(params);}
    else {return false;}
>>>>>>> master
  }

  stream(id, quality) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.stream(id, quality); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.stream(id, quality);}
    else {return false;}
>>>>>>> master
  }

  download(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.download(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.download(id);}
    else {return false;}
>>>>>>> master
  }

  getCoverArt(params) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.getCoverArt(params); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.getCoverArt(params);}
    else {return false;}
>>>>>>> master
  }

  scrobble(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.scrobble(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.scrobble(id);}
    else {return false;}
>>>>>>> master
  }

  scrobbleNowPlaying(id) {
    this.doLogin();
<<<<<<< HEAD
    if (this.isLoggedIn) { return this.alloydb.scrobbleNowPlaying(id); }
    else { return false; }
=======
    if (this.isLoggedIn)
      {return this.alloydb.scrobbleNowPlaying(id);}
    else {return false;}
>>>>>>> master
  }

  loadArtists(data) {

    if (data) {
      data.forEach((info) => {
        if (info.artists) {
          this.$rootScope.artists = info.artists;
          this.$rootScope.artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id, width: 100, height: 100 });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadFresh(data) {

    if (data) {
      data.forEach((info) => {
        if (info.fresh) {
          this.$rootScope.fresh_albums = info.fresh.albums;
          this.$rootScope.fresh_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
            album.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.cover_art });
            });
          });
          this.$rootScope.fresh_artists = info.fresh.artists;
          this.$rootScope.fresh_artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id });
            artist.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.cover_art });
            });
          });
          this.$rootScope.fresh_tracks = this.AppUtilities.getRandom(info.fresh.tracks, info.fresh.tracks.length);
          this.$rootScope.fresh_tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadHistory(data) {
    if (data) {
      data.forEach((info) => {
        if (info.history) {
          this.$rootScope.history = info.history;
          this.$rootScope.history.forEach((item) => {
            item.image = this.getCoverArt({ track_id: item.id });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadAlbums(data) {

    if (data) {
      data.forEach((info) => {
        if (info.albums) {
          this.$rootScope.albums = info.albums;
          this.$rootScope.albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadGenres(data) {

    if (data) {
      data.forEach((info) => {
        if (info.genres) {
          this.$rootScope.genres = info.genres;
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadStarred(data) {

    if (data) {
      data.forEach((info) => {
        if (info.starred) {
          this.$rootScope.starred_artists = info.starred.artists;
          this.$rootScope.starred_artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id });
          });
          this.$rootScope.starred_top_artists = info.starred.top_artists;
          this.$rootScope.starred_top_artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id });
          });
          this.$rootScope.starred_tracks = info.starred.tracks;
          this.$rootScope.starred_tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.starred_top_tracks = info.starred.top_tracks;
          this.$rootScope.starred_top_tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.starred_albums = info.starred.albums;
          this.$rootScope.starred_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
            album.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.id });
            });
          });
          this.$rootScope.starred_top_albums = info.starred.top_albums;
          this.$rootScope.starred_top_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
            album.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.id });
            });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadIndex(data) {

    if (data) {
      data.forEach((info) => {
        if (info.index) {
          this.$rootScope.music_index = info.index;
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadRandom(data) {

    if (data) {
      data.forEach((info) => {
        if (info.random) {
          this.$rootScope.random = info.random;
          this.$rootScope.random.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.cover_art });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadCharts(data) {
    if (data) {
      data.forEach((info) => {
        if (info.charts) {
          this.$rootScope.charts = info.charts;
          this.$rootScope.charts.top_tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.charts.never_played.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.charts.never_played_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
          });


          this.AppUtilities.apply();
        }
      });
    }
  }

  loadPlaylists(data) {
    if (data) {
      data.forEach((info) => {
        if (info.playlists) {
          this.$rootScope.playlists = info.playlists;
          this.$rootScope.playlists.forEach((playlist) => {
            playlist.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.id });
            });
          });

          this.AppUtilities.apply();
        }
      });
    }
  }

  refreshArtists() {

    var artists = this.getArtists();
    if (artists) {
      artists.then((info) => {
        this.loadArtists([info]);
      });
    }
  }

  refreshFresh() {

    var fresh = this.getFresh(50);
    if (fresh) {
      fresh.then((info) => {
        this.loadFresh([info]);
      });
    }
  }

  refreshHistory() {

    var history = this.getHistory();
    if (history) {
      history.then((info) => {
        this.loadHistory([info]);
      });
    }
  }

  refreshAlbums() {

    var albums = this.getAlbums();
    if (albums) {
      albums.then((info) => {
        this.loadAlbums([info]);
      });
    }
  }

  refreshGenres() {

    var genres = this.getGenres();
    if (genres) {
      genres.then((info) => {
        this.loadGenres([info]);
      });
    }
  }

  refreshStarred() {

    var starred = this.getStarred();
    if (starred) {
      starred.then((info) => {
        this.loadStarred([info]);
      });
    }
  }

  refreshIndex() {

    var index = this.getArtistsIndex();
    if (index) {
      index.then((info) => {
        this.loadIndex([info]);
      });
    }
  }

  refreshRandom() {

    var random = this.getRandomSongs();
    if (random) {
      random.then((info) => {
        this.loadRandom([info]);
      });
    }
  }

  refreshCharts() {

    var chartTopTracks = this.getCharts();
    if (chartTopTracks) {
      chartTopTracks.then((info) => {
        this.loadCharts([info]);
      });
    }
  }

  refreshPlaylists() {

    var playlists = this.getPlaylists();
    if (playlists) {
      playlists.then((info) => {
        this.loadPlaylists([info]);
      });
    }
  }

  refreshPage(page) {
    console.log(page);
  }

  preload() {

    var index = this.getArtistsIndex();
    var history = this.getHistory();
    var artists = this.getArtists();
    var fresh = this.getFresh(50);
    var albums = this.getAlbums();
    var genres = this.getGenres();
    var starred = this.getStarred();
    var random = this.getRandomSongs();
    var charts = this.getCharts();
    var playlists = this.getPlaylists();

    Promise.all([index, history, artists, fresh, albums, genres, starred, random, charts, playlists]).then((info) => {
      if (info) {
        this.loadIndex(info);
        this.loadHistory(info);
        this.loadArtists(info);
        this.loadFresh(info);
        this.loadAlbums(info);
        this.loadGenres(info);
        this.loadStarred(info);
        this.loadRandom(info);
        this.loadCharts(info);
        this.loadPlaylists(info);
        this.AppUtilities.apply();
      }
    });
  }
}