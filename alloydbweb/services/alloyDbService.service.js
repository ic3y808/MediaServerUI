import AlloyApi from "../API/alloy.db";
import _ from "lodash";
export default class AlloyDbService {
  constructor($rootScope, Logger, AppUtilities, $window) {
    "ngInject";
    this.isLoggingIn = true;
    this.isLoggedIn = false;
    this.$rootScope = $rootScope;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.$window = $window;
    this.$rootScope.refreshPage = this.refreshPage;
    this.$rootScope.starArtist = this.starArtist;
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
    if (this.isLoggedIn) { return this.alloydb.ping(); }
    else { return false; }
  }

  clearCache() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.clearCache(); }
    else { return false; }
  }

  clearStarredCache() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.clearStarredCache(); }
    else { return false; }
  }

  getSchedulerStatus() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getSchedulerStatus(); }
    else { return false; }
  }

  getLibraryInfo() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getLibraryInfo(); }
    else { return false; }
  }

  getFileList(path) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getFileList(path); }
    else { return false; }
  }

  getFileParent(path) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getFileParent(path); }
    else { return false; }
  }

  getMediaPaths() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getMediaPaths(); }
    else { return false; }
  }

  addMediaPath(mediaPath) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.addMediaPath(mediaPath); }
    else { return false; }
  }

  removeMediaPath(mediaPath) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.removeMediaPath(mediaPath); }
    else { return false; }
  }

  getArtistsIndex() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getArtistsIndex(); }
    else { return false; }
  }

  getRandomSongs() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getRandomSongs(); }
    else { return false; }
  }

  getFresh(limit) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getFresh(limit); }
    else { return false; }
  }

  getArtists() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getArtists(); }
    else { return false; }
  }

  getAlbums() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getAlbums(); }
    else { return false; }
  }

  getAlbum(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getAlbum(id); }
    else { return false; }
  }

  getGenre(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getGenre(id); }
    else { return false; }
  }

  getGenres() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getGenres(); }
    else { return false; }
  }

  getArtist(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getArtist(id); }
    else { return false; }
  }

  getArtistInfo(artist) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getArtistInfo(artist); }
    else { return false; }
  }

  getAlbumInfo(artist, album) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getAlbumInfo(artist, album); }
    else { return false; }
  }

  getTrackInfo(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getTrackInfo(id); }
    else { return false; }
  }

  getGenreInfo(genre) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getGenreInfo(genre); }
    else { return false; }
  }

  getStarred() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getStarred(); }
    else { return false; }
  }

  getHistory() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getHistory(); }
    else { return false; }
  }

  scanStart() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.scanStart(); }
    else { return false; }
  }

  scanStatus() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.scanStatus(); }
    else { return false; }
  }

  scanCancel() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.scanCancel(); }
    else { return false; }
  }

  backup() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.backup(); }
    else { return false; }
  }

  restore(data) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.restore(data); }
    else { return false; }
  }

  getCharts() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getCharts(); }
    else { return false; }
  }

  search(query) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.search(query); }
    else { return false; }
  }

  addPlay(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.addPlay(id); }
    else { return false; }
  }

  addHistory(data) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.addHistory(data); }
    else { return false; }
  }

  getPlaylist(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getPlaylist(id); }
    else { return false; }
  }

  getPlaylists() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getPlaylists(); }
    else { return false; }
  }

  addPlaylist(data) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.addPlaylist(data); }
    else { return false; }
  }

  updatePlaylist(data) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.updatePlaylist(data); }
    else { return false; }
  }

  removePlaylist(data) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.removePlaylist(data); }
    else { return false; }
  }

  love(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.love(params); }
    else { return false; }
  }

  unlove(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.unlove(params); }
    else { return false; }
  }

  star(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.star(params); }
    else { return false; }
  }

  unstar(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.unstar(params); }
    else { return false; }
  }

  setRating(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.setRating(params); }
    else { return false; }
  }

  stream(id, bitrate, format) {
    this.doLogin();
    return this.alloydb.stream(id, bitrate, format);
  }

  download(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.download(id); }
    else { return false; }
  }

  getCoverArt(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getCoverArt(params); }
    else { return false; }
  }

  scrobble(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.scrobble(id); }
    else { return false; }
  }

  scrobbleNowPlaying(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.scrobbleNowPlaying(id); }
    else { return false; }
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
          var albumTracks = [];
          this.$rootScope.fresh_albums = this.AppUtilities.getRandom(info.fresh.albums, info.fresh.albums.length);
          this.$rootScope.fresh_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
            album.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.cover_art });
              albumTracks.push(track);
            });
          });
          this.$rootScope.quick_picks = this.AppUtilities.getRandom(albumTracks, 10);
          this.$rootScope.quick_picks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.fresh_artists = this.AppUtilities.getRandom(info.fresh.artists, info.fresh.artists.length);
          this.$rootScope.fresh_artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id });
            artist.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.cover_art });
            });
          });
          // var t = _.uniq(info.fresh.tracks, "album");


          this.$rootScope.fresh_tracks = info.fresh.tracks;
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
          this.$rootScope.history = info;
          this.$rootScope.history.history.forEach((item) => {
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

    var fresh = this.getFresh(100);
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

  preload() {

    var index = this.getArtistsIndex();
    var history = this.getHistory();
    var artists = this.getArtists();
    var fresh = this.getFresh(100);
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

  refreshPage(path) {
    //var path = window.location.pathname;
    switch (path) {
      case "/": this.preload(); break;
      case "/fresh": this.refreshFresh(); this.refreshCharts(); break;
      case "/artists": this.refreshArtists(); break;
      case "/albums": this.refreshAlbums(); break;
      case "/genres": this.refreshGenres(); break;
      case "/starred": this.refreshStarred(); break;
      default: this.preload();
    }
    console.log(path);
  }

  starArtist(artist) {

    if (artist.starred === "true") {
      this.unstar({
        artist: artist.id
      }).then((result) => {
        artist.starred = "false";
        this.AppUtilities.apply();
      });
    } else {
      this.star({
        artist: artist.id
      }).then((result) => {
        artist.starred = "true";
        this.AppUtilities.apply();
      });
    }
  }
}