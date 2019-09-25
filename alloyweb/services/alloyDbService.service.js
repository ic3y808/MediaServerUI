import AlloyApi from "../API/alloy.db";
export default class AlloyDbService {
  constructor($rootScope, AppUtilities, Logger, $window) {
    "ngInject";
    this.isLoggingIn = false;
    this.isLoggedIn = false;
    this.isPreloaded = false;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Logger = Logger;
    this.$window = $window;
    this.$rootScope.refreshPage = this.refreshPage;
    this.$rootScope.starTrack = this.starTrack;
    this.$rootScope.starArtist = this.starArtist;
  }

  updateStatus() {
    this.AppUtilities.broadcast("loginStatusChange", {
      service: "alloydb",
      isLoggedIn: this.isLoggedIn
    });
  }

  doLogin() {
    if (this.$rootScope.settings && this.$rootScope.settings.alloydb && this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
      if (!this.isLoggedIn && !this.isLoggingIn) {
        this.Logger.info("logging into alloydb");

        this.alloydb = new AlloyApi(this.$rootScope.settings.alloydb);

        var ping = this.alloydb.ping();
        if (ping) {
          ping.then((result) => {
            if (result) {
              if (result.status === "success") {
                this.isLoggedIn = true;
                this.isLoggingIn = false;
                this.Logger.info("Connected to alloydb");
                var loggedInUser = this.$rootScope.globals.currentUser;
                if (loggedInUser) {
                  this.checkinUser(loggedInUser.username);
                }
                if (!this.isPreloaded) { this.preload(); }
              } else {
                this.isLoggingIn = false;
                this.isLoggedIn = false;
                this.Logger.info("Failed to connect to alloydb");
              }
            }
            this.updateStatus();
          }).catch((err) => {
            this.isLoggingIn = false;
            this.updateStatus();
          });
        }
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

  startTask(task) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.startTask(task); }
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

  getShare(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getShare(id); }
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

  getRecent(limit = 20, offset = 0) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getRecent(limit, offset); }
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

  getShareLink(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getShareLink(id); }
    else { return false; }
  }

  deleteShare(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.deleteShare(id); }
    else { return false; }
  }

  share() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.share(this.$rootScope.newShare); }
    else { return false; }
  }

  createShare(type, id, description = "", expires = "", url = "") {
    var that = this;
    this.$rootScope.newShare.type = type;
    this.$rootScope.newShare.id = id;
    this.$rootScope.newShare.description = description;
    this.$rootScope.newShare.expires = expires;
    this.$rootScope.newShare.url = url;
    return new Promise((resolve, reject) => {

      $("#shareModal").on("hidden.bs.modal", function () {
        $(this).data("bs.modal", null);
        that.$rootScope.newShare = {
          type: "",
          id: "",
          description: "",
          expires: "",
          url: ""
        };
        that.AppUtilities.apply();
      });
      var $this = $(this)
        , $remote = $this.data("remote") || $this.attr("href")
        , $modal = $("#shareModal");
      $modal.modal();
    });
  }

  shareTrack(id) {
    this.Logger.debug("shareButton");
    return this.createShare("track", id).then((result) => {
    });
  }

  shareAlbum(id) {
    this.Logger.debug("shareButton");
    return this.createShare("album", id).then((result) => {
    });
  }

  shareArtist(id) {
    this.Logger.debug("shareButton");
    return this.createShare("artist", id).then((result) => {
    });
  }

  shareGenre(id) {
    this.Logger.debug("shareButton");
    return this.createShare("genre", id).then((result) => {
    });
  }

  getShares() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getShares(); }
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

  getUsers() {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.getUsers(); }
    else { return false; }
  }

  newUser() {
    this.doLogin();
    var newUser = {};
    Object.assign(newUser, this.$rootScope.newUser);
    newUser.username = this.AppUtilities.encryptPassword(this.$rootScope.newUser.username);
    newUser.password = this.AppUtilities.encryptPassword(this.$rootScope.newUser.password);
    if (this.isLoggedIn) { return this.alloydb.createUser(newUser); }
    else { return false; }
  }

  createUser() {
    var that = this;
    $("#createUserModal").on("hidden.bs.modal", function () {
      $(this).data("bs.modal", null);
      that.$rootScope.newUser = {
        type: "",
        username: "",
        password: ""
      };
      that.AppUtilities.apply();
    });

    var $this = $(this)
      , $remote = $this.data("remote") || $this.attr("href")
      , $modal = $("#createUserModal");
    $modal.modal();
    $("#createUserForm").parsley().on("field:validated", () => {
      var ok = $(".parsley-error").length === 0;
      $(".bs-callout-info").toggleClass("hidden", !ok);
      $(".bs-callout-warning").toggleClass("hidden", ok);
    }).on("form:submit", () => {
      var ok = $(".parsley-error").length === 0;
      if (ok) {
        that.$rootScope.createUser();
      }
    });


  }

  deleteUser(id) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.deleteUser(id); }
    else { return false; }
  }

  loginUser(params) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.loginUser(params); }
    else { return false; }
  }

  checkinUser(username) {
    this.doLogin();
    if (this.isLoggedIn) { return this.alloydb.checkinUser(username); }
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
    if (this.isLoggedIn) {
      return this.alloydb.getCoverArt(params);
    }
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
            artist.image = this.getCoverArt({ artist_id: artist.id });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadArtist(data) {
    if (data) {
      data.forEach((info) => {
        if (info) {
          this.$rootScope.artist = info;
          this.$rootScope.artist.image = this.getCoverArt({ artist_id: this.$rootScope.artist.artist.id });
          this.$rootScope.artist.artist.biography = JSON.parse(JSON.stringify(this.$rootScope.artist.artist.biography));

          this.$rootScope.artist.tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });

          this.$rootScope.artist.albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
          });

          this.$rootScope.artist.singles.forEach((single) => {
            single.image = this.getCoverArt({ album_id: single.id });
          });

          this.$rootScope.artist.EPs.forEach((ep) => {
            ep.image = this.getCoverArt({ album_id: ep.id });
          });

          this.$rootScope.artist.popular_tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
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
          this.$rootScope.fresh_recently_added_albums = info.fresh.recently_added_albums;
          this.$rootScope.fresh_recently_added_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
            album.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.cover_art });
            });
          });
          this.$rootScope.fresh_albums = info.fresh.albums;
          this.$rootScope.fresh_albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
            album.tracks.forEach((track) => {
              track.image = this.getCoverArt({ track_id: track.cover_art });
              albumTracks.push(track);
            });
          });
          this.$rootScope.quick_picks = info.fresh.quick_picks;
          this.$rootScope.quick_picks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.fresh_artists = info.fresh.artists;
          this.$rootScope.fresh_artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id });
            //artist.tracks.forEach((track) => {
            //  track.image = this.getCoverArt({ track_id: track.cover_art });
            //});
          });
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

  loadRecent(data) {
    if (data) {
      data.forEach((info) => {
        if (info.recently_added_albums) {
          this.$rootScope.recently_added_albums = info.recently_added_albums;
          this.$rootScope.recently_added_albums.forEach((item) => {
            item.image = this.getCoverArt({ album_id: item.id });
          });
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadAlbum(data) {
    if (data) {
      data.forEach((info) => {
        if (info) {
          this.$rootScope.album = info;

          var coverArt = this.getCoverArt({ album_id: this.$rootScope.album.album.id });

          if (coverArt) {
            this.$rootScope.album.album.image = coverArt;
            this.AppUtilities.apply();
          }
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

  loadGenre(data) {
    if (data) {
      data.forEach((info) => {
        if (info) {
          this.$rootScope.genre = info;
          this.$rootScope.genre.tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.genre.never_played.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.genre.popular_tracks.forEach((track) => {
            track.image = this.getCoverArt({ track_id: track.id });
          });
          this.$rootScope.genre.artists.forEach((artist) => {
            artist.image = this.getCoverArt({ artist_id: artist.id });
          });
          this.$rootScope.genre.albums.forEach((album) => {
            album.image = this.getCoverArt({ album_id: album.id });
          });
          var randomTrack = this.$rootScope.genre.tracks[Math.floor(Math.random() * this.$rootScope.genre.tracks.length)];
          if (randomTrack) {
            this.$rootScope.genre.image = this.getCoverArt({ track_id: randomTrack.id });
          }
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

  loadShares(data) {
    if (data) {
      data.forEach((info) => {
        if (info.shares) {
          this.$rootScope.shares = info.shares;
          this.AppUtilities.apply();
        }
      });
    }
  }

  loadUsers(data) {
    if (data) {
      data.forEach((info) => {
        if (info.users) {
          this.$rootScope.users = info.users;
          this.$rootScope.users.forEach((user) => {
            if (user.username) { user.username = this.AppUtilities.decryptPassword(user.username); }
            if (user.password) { user.password = this.AppUtilities.decryptPassword(user.password); }
            if (user.lastfm_username) { user.lastfm_username = this.AppUtilities.decryptPassword(user.lastfm_username); }
            if (user.lastfm_password) { user.lastfm_password = this.AppUtilities.decryptPassword(user.lastfm_password); }
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

  refreshArtist(id) {
    this.$rootScope.artist = { artist: { name: "Loading..." } };
    this.AppUtilities.apply();
    var artist = this.getArtist(id);
    if (artist) {
      artist.then((info) => {
        this.loadArtist([info]);
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
    var fresh = this.getFresh(20);
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

  refreshRecent(limit, offset) {
    var recent = this.getRecent(limit, offset);
    if (recent) {
      recent.then((info) => {
        this.loadRecent([info]);
      });
    }
  }

  refreshAlbum(id) {
    this.$rootScope.album = { album: { name: "Loading..." } };
    this.AppUtilities.apply();
    var album = this.getAlbum(id);
    if (album) {
      album.then((info) => {
        this.loadAlbum([info]);
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

  refreshGenre(id) {
    this.$rootScope.genre = { genre: { name: "Loading..." } };
    this.AppUtilities.apply();
    var genre = this.getGenre(id);
    if (genre) {
      genre.then((info) => {
        this.loadGenre([info]);
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

  refreshShares() {
    var shares = this.getShares();
    if (shares) {
      shares.then((info) => {
        this.loadShares([info]);
      });
    }
  }

  refreshUsers() {
    var users = this.getUsers();
    if (users) {
      users.then((info) => {
        this.loadUsers([info]);
      });
    }
  }

  preload() {

    var index = this.getArtistsIndex();
    var history = this.getHistory();
    var artists = this.getArtists();
    var fresh = this.getFresh(20);
    var albums = this.getAlbums();
    var genres = this.getGenres();
    var starred = this.getStarred();
    var random = this.getRandomSongs();
    var charts = this.getCharts();
    var playlists = this.getPlaylists();
    var shares = this.getShares();
    var users = this.getUsers();

    Promise.all([index, history, artists, fresh, albums, genres, starred, random, charts, playlists, shares, users]).then((info) => {
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
        this.loadShares(info);
        this.loadUsers(info);
        this.isPreloaded = true;
        this.AppUtilities.apply();
      }
    });
  }

  refreshPage(path) {
    if (path.indexOf("/artist/") !== -1 || path.indexOf("/album/") !== -1 || path.indexOf("/genre/") !== -1) {
      var parts = path.split("/");
      var type = parts[1];
      var id = parts[2];
      switch (type) {
        case "artist":
          this.refreshArtist(id);
          break;
        case "album":
          this.refreshAlbum(id);
          break;
        case "genre":
          this.refreshGenre(id);
          break;
      }
    } else {
      switch (path) {
        case "/": this.refreshCharts(); break;
        case "/fresh": this.refreshFresh(); this.refreshCharts(); break;
        case "/artists": this.refreshArtists(); break;
        case "/albums": this.refreshAlbums(); break;
        case "/genres": this.refreshGenres(); break;
        case "/history": this.refreshHistory(); break;
        case "/recent": this.refreshRecent(200,0); break;
        case "/starred": this.refreshStarred(); break;
        case "/shares": this.refreshShares(); break;
        case "/users": this.refreshUsers(); break;
        default: this.preload();
      }
    }
  }

  starArtist(artist) {

    if (artist.starred === "true") {
      this.unstar({
        artist: artist.id
      }).then((result) => {
        artist.starred = "false";
        this.Logger.info("UnStarred " + artist.name + " " + JSON.stringify(result));
        this.refreshStarred();
      });
    } else {
      this.star({
        artist: artist.id
      }).then((result) => {
        artist.starred = "true";
        this.Logger.info("UnStarred " + artist.name + " " + JSON.stringify(result));
        this.refreshStarred();
      });
    }
  }

  starAlbum(album) {
    if (album.starred === "true") {
      this.unstar({
        artist: album.id
      }).then((result) => {
        album.starred = "false";
        this.Logger.info("UnStarred " + album.name + " " + JSON.stringify(result));
        this.refreshStarred();
      });
    } else {
      this.star({
        album: album.id
      }).then((result) => {
        this.Logger.info("UnStarred " + album.name + " " + JSON.stringify(result));
        album.starred = "true";
        this.refreshStarred();
      });
    }
  }

  starTrack(track) {
    this.Logger.info("Trying to star track: " + track.title);
    if (track.starred === "true") {
      this.unstar({ id: track.id }).then((result) => {
        this.Logger.info("UnStarred " + track.title + " " + JSON.stringify(result));
        track.starred = "false";
        this.refreshStarred();
      });
    } else {
      this.star({ id: track.id }).then((result) => {
        this.Logger.info("Starred " + track.title + " " + JSON.stringify(result));
        track.starred = "true";
        this.refreshStarred();
      });
    }
  }
}