const _ = require("lodash");
const moment = require("moment");
const path = require("path");
const mime = require("mime-types");
const fs = require("fs");
const del = require("del");
const shell = require("shelljs");
const jimp = require("jimp");
const { ipcRenderer } = require("electron");
var loggerTag = "MediaScannerBase";
var LastFM = require(path.join(process.env.APP_DIR, "common", "simple-lastfm"));

module.exports = class MediaScannerBase {

  constructor(database) {
    this.db = database;
    this.resetStatus();
    this.queue = {};
    this.tickets = {};
    this.convert = require(path.join(process.env.APP_DIR, "common", "convert"));
    this.mm = require(path.join(process.env.APP_DIR, "alloyapi", "music-metadata"));
    this.cryptoFuncs = window.require(path.join(process.env.APP_DIR, "common", "crypto"));
    this.lastfm = new LastFM();
    this.lastfm.login(this.getLastFmOptions());
  }

  log(obj) { ipcRenderer.send("log", obj); }
  info(messsage) { this.log({ level: "info", label: loggerTag, message: messsage }); }
  debug(debug) { this.log({ level: "debug", label: loggerTag, message: debug }); }
  error(error) { this.log({ level: "error", label: loggerTag, message: error }); }

  shouldCancel() {
    return this.scanStatus.shouldCancel;
  }

  cancelScan() {
    if (this.isScanning()) {
      this.updateStatus("Cancelling scan", false);
      this.info("Cancelling scan");
      this.scanStatus.shouldCancel = true;
      setTimeout(() => {
        this.scanStatus.shouldCancel = false;
      }, 5000);
      this.tickets = {};
    } else {
      this.updateStatus("Cancelled scanning", false);
      this.info("Cancelled scanning");
    }
  }

  resetStatus() {
    this.scanStatus = {
      status: "",
      isScanning: false,
      shouldCancel: false
    };
  }

  updateStatus(status, isScanning, opts = {}) {
    this.scanStatus.status = status;
    this.scanStatus.isScanning = isScanning;
    this.checkQueue();
    Object.assign(opts, this.scanStatus);
    ipcRenderer.send("mediascanner-status", opts);
  }

  checkQueue() {
    if (this.queue) {
      if (this.queue._tickets) {
        var keys = Object.keys(this.queue._tickets);
        keys.forEach((key) => {
          if (this.tickets) {
            this.tickets[key] = this.queue._tickets[key].tickets[0];
          }
        });
      }

      if (this.tickets) {
        var ticketKeys = Object.keys(this.tickets);

        ticketKeys.forEach((key) => {
          if (this.tickets[key].isFinished === true || this.tickets[key].isFinished === "true") {
            delete this.tickets[key];
          }
        });
        this.scanStatus.queue = this.tickets;
      }
      //this.scanStatus.queue.stats = this.queue.getStats(); 
    }
  }

  getStatus() {
    return this.scanStatus;
  }

  isScanning() {
    return this.scanStatus.isScanning;
  }

  downloadPage(url, method = "GET") {
    return new Promise((resolve, reject) => {
      resolve(ipcRenderer.sendSync("web-request", { url: url, method: method }));
    });
  }

  checkCounts() {
    this.info("checking counts");
    this.updateStatus("checking counts", true);
    var genres = this.db.prepare("SELECT id FROM Genres").all();
    genres.forEach((g) => {
      var albums = [];
      var artists = [];
      var tracks = this.db.prepare("SELECT artist_id, album_id FROM Tracks WHERE genre_id=?").all(g.id);
      tracks.forEach((track) => {
        artists.push(track.artist_id);
        albums.push(track.album_id);
      });
      albums = _.uniq(albums);
      artists = _.uniq(artists);
      this.db.prepare("UPDATE Genres SET track_count=?, artist_count=?, album_count=? WHERE id=?").run(tracks.length, artists.length, albums.length, g.id);
    });

    var albums = this.db.prepare("SELECT * FROM Albums").all();
    albums.forEach((a) => {
      var tracks = this.db.prepare("SELECT id FROM Tracks WHERE album_id=?").all(a.id);
      this.db.prepare("UPDATE Albums SET track_count=? WHERE id=?").run(tracks.length, a.id);
    });
  }

  checkSortOrder() {
    this.info("checking table sort orders");
    this.updateStatus("checking base sort order", true);
    var allArtists = this.db.prepare("SELECT * FROM Artists ORDER BY name COLLATE NOCASE ASC").all();
    for (var i = 0; i < allArtists.length; ++i) {
      this.db.prepare("UPDATE Artists SET sort_order=? WHERE id=?").run(i, allArtists[i].id);
    }
  }

  checkEmptyArtists() {
    this.info("checking empty artists");
    this.updateStatus("checking missing media", true);
    var allMedia = this.db.prepare("SELECT * FROM Artists").all();
    allMedia.forEach((artist) => {
      var anyArtists = this.db.prepare("SELECT * FROM Tracks WHERE artist_id=?").all(artist.id);
      if (anyArtists.length === 0) {
        this.db.prepare("DELETE FROM Artists WHERE id=?").run(artist.id);
        this.writeScanEvent("delete-artist", artist, "Deleted mapped artist because it was empty", "success");
      }
    });
  }

  checkEmptyAlbums() {
    this.info("checking empty albums");
    this.updateStatus("checking missing albums", true);
    var allMedia = this.db.prepare("SELECT * FROM Albums").all();
    allMedia.forEach((album) => {
      var anyTracks = this.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
      if (anyTracks.length === 0) {
        this.db.prepare("DELETE FROM Albums WHERE id=?").run(album.id);
        this.writeScanEvent("delete-album", album, "Deleted mapped album because it was empty", "success");
      }
    });
  }

  checkEmptyGenres() {
    this.info("checking empty genres");
    this.updateStatus("checking empty genres", true);
    var allMedia = this.db.prepare("SELECT * FROM Genres").all();
    allMedia.forEach((genre) => {
      var anyGenres = this.db.prepare("SELECT * FROM Tracks WHERE genre_id=?").all(genre.id);
      if (anyGenres.length === 0) {
        this.db.prepare("DELETE FROM Genres WHERE id=?").run(genre.id);
        this.writeScanEvent("delete-genre", genre, "Deleted mapped genre because it was empty", "success");
      }
    });
  }

  checkEmptyPlaylists() {
    this.info("checking empty playlists");
    this.updateStatus("checking empty playlists", true);
    var allPlayslits = this.db.prepare("SELECT * FROM Playlists").all();
    allPlayslits.forEach((playlist) => {
      var anyTracks = this.db.prepare("SELECT * FROM PlaylistTracks WHERE id=?").all(playlist.id);
      if (anyTracks.length === 0) {
        this.db.prepare("DELETE FROM Playlists WHERE id=?").run(playlist.id);
        this.writeScanEvent("delete-playlist", playlist, "Deleted playlist because it was empty", "success");
      }
    });
  }

  checkExtraAlbumArt() {
    this.info("checking extra art");
    this.updateStatus("checking extra art", true);
    if (!fs.existsSync(process.env.COVER_ART_DIR)) {
      fs.mkdirSync(process.env.COVER_ART_DIR);
    }

    fs.readdir(process.env.COVER_ART_DIR, (err, items) => {
      items.forEach((file) => {
        var anyArt = this.db.prepare("SELECT * FROM CoverArt WHERE id=?").all(file.replace(".jpg", ""));
        if (anyArt.length === 0) { del.sync(path.join(process.env.COVER_ART_DIR, file)); }
      });
    });
  }

  checkTracksExist() {
    this.info("checking missing tracks");
    var allTracks = this.db.prepare("SELECT * FROM Tracks").all();
    allTracks.forEach((track) => {
      if (!fs.existsSync(track.path)) {
        this.db.prepare("DELETE FROM Tracks WHERE id = ?").run(track.id);
        this.writeScanEvent("delete-track", track, "Deleted mapped track, file no longer exists", "success");
      }
    });
  }

  checkHistory() {
    this.info("checking history");
    var allHistory = this.db.prepare("SELECT * FROM History").all();
    allHistory.forEach((item) => {
      var track = this.db.prepare("SELECT * FROM Tracks WHERE id=?").get(item.id);
      if (track) {
        var sql = "REPLACE INTO History (history_id, id, type, action, time, title, artist, artist_id, album, album_id, genre, genre_id) VALUES(@history_id, @id, @type, @action, @time, @title, @artist, @artist_id, @album, @album_id, @genre, @genre_id)  ";
        try {
          item.title = track.title;
          item.artist = track.artist;
          item.artist_id = track.artist_id;
          item.album = track.album;
          item.album_id = track.album_id;
          item.genre = track.genre;
          item.genre_id = track.genre_id;
          var insert = this.db.prepare(sql);
          insert.run(item);
        } catch (err) {
          if (err) { this.error(err); }
          this.info(sql);
        }
      }
    });
  }

  checkCache() {
    var settingsResult = this.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
    if (settingsResult && settingsResult.settings_value) {
      var settings = JSON.parse(settingsResult.settings_value);
      if (settings) {
        switch (settings.alloydb_streaming_cache_strat) {
          case "trackcount":
            var trackLimit = settings.alloydb_streaming_cache_strat_tracks;
            var files = fs.readdirSync(process.env.CONVERTED_MEDIA_DIR);
            files = files.map(function (fileName) {
              return {
                name: fileName,
                time: fs.statSync(path.join(process.env.CONVERTED_MEDIA_DIR, fileName)).ctime.getTime()
              };
            }).sort(function (a, b) {
              return a.time - b.time;
            }).map(function (v) {
              return v.name;
            });
            while (files.length > trackLimit) {
              shell.rm(path.join(process.env.CONVERTED_MEDIA_DIR, files[0]));
              files.shift();
            }
            break;
          case "days":
            var dayslimit = settings.alloydb_streaming_cache_strat_days;
            var d = new Date();
            d.setDate(d.getDate() - dayslimit);
            var files2 = fs.readdirSync(process.env.CONVERTED_MEDIA_DIR);
            files2.forEach((fileName) => {
              if (fs.statSync(path.join(process.env.CONVERTED_MEDIA_DIR, fileName)).ctime.getTime() < d) {
                shell.rm(path.join(process.env.CONVERTED_MEDIA_DIR, fileName));
              }
            });
            break;
          case "memory":
            var memLimit = settings.alloydb_streaming_cache_strat_memory;

            memLimit = memLimit.replace("GB", "");
            memLimit = memLimit * 1024;
            var files3 = fs.readdirSync(process.env.CONVERTED_MEDIA_DIR);
            files3 = files3.map(function (fileName) {
              return {
                name: fileName,
                time: fs.statSync(path.join(process.env.CONVERTED_MEDIA_DIR, fileName)).ctime.getTime()
              };
            }).sort(function (a, b) {
              return a.time - b.time;
            }).map(function (v) {
              return v.name;
            });

            var totalSize = 0;
            files3.forEach((fileName) => {
              const stats = fs.statSync(path.join(process.env.CONVERTED_MEDIA_DIR, fileName));
              totalSize += stats.size / 1000000.0;
            });

            while (totalSize > memLimit) {
              var fileName = files3.shift();
              const stats = fs.statSync(path.join(process.env.CONVERTED_MEDIA_DIR, fileName));
              totalSize -= stats.size / 1000000.0;
              shell.rm(path.join(process.env.CONVERTED_MEDIA_DIR, fileName));
            }
            break;
        }
      }
    }
  }

  checkLastFmStep() {

    //if (this.scanStatus.shouldCancel) return;
    var track = this.filteredFiles.shift();
    if (!track || !track.path) {
      this.updateStatus("Scanning Complete", false);
    } else {
      try {
        this.getLastfmSession(() => {
          this.updateStatus("Scanning Track " + track.path, true);
          this.lastfm.getTrackInfo({
            artist: track.artist === "No Artist" ? track.base_path : track.artist,
            track: track.title,
            mbid: track.musicbrainz_artistid,
            callback: (result) => {
              var data = JSON.stringify(result.trackInfo);
              var entry = { id: track.id, type: "track", data: data };
              this.writeDb(entry, "LastFM");
              var updateTrack = false;

              if (result.trackInfo.userloved === "1") {
                track.starred = "true";
                updateTrack = true;
              }

              if (result.trackInfo.userplaycount !== "0") {
                track.play_count = parseInt(result.trackInfo.userplaycount, 10);
                updateTrack = true;
              }

              if (updateTrack) {
                this.writeDb(track, "Tracks");
              }

              if (this.filteredFiles.length > 0) { this.checkLastFmStep(); }
              else {
                this.updateStatus("Scanning Complete", false);
                setTimeout(() => {
                  this.resetStatus();
                }, 5000);
              }
            }
          });
        });
      } catch (err) {
        this.updateStatus("Scanning Error " + err.message, false);
        if (this.filteredFiles.length > 0) { this.step(); }
        else {
          this.updateStatus("Scanning Complete", false);
        }
      }
    }
  }

  getLastFmOptions() {
    var lastfmSettings = this.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
    if (lastfmSettings && lastfmSettings.settings_value) {
      var settings = JSON.parse(lastfmSettings.settings_value);
      if (settings) {
        if (settings.alloydb_lastfm_username && settings.alloydb_lastfm_password) {

          return {
            api_key: process.env.LASTFM_API_KEY,
            api_secret: process.env.LASTFM_API_SECRET,
            username: settings.alloydb_lastfm_username,
            password: this.cryptoFuncs.decryptPassword(settings.alloydb_lastfm_password)
          };
        } else {
          this.error("No lastfm username or password.");
        }
      } else {
        this.error("Could not parse settings.");
      }
    } else {
      this.error("Could not load lastfm settings.");
    }
    return null;
  }

  getLastfmSession(cb) {
    var lsfm = this.lastfm;
    if (lsfm) { lsfm.getSessionKey(cb); }
    else {
      cb({ result: { failure: "failed" } });
    }
  }

  parseFiles(audioFiles) {
    if (this.shouldCancel()) { return Promise.resolve(); }
    const track = audioFiles.shift();

    if (track) {
      //this.updateStatus("Collecting album art ", true, track.path);
      var coverId = "cvr_" + track.album_id;
      var coverFileOrig = path.join(process.env.COVER_ART_DIR, coverId + ".orig.jpg");
      var coverFileThumb = path.join(process.env.COVER_ART_DIR, coverId + ".jpg");


      if (!fs.existsSync(coverFileThumb) || !fs.existsSync(coverFileOrig)) {
        return this.mm.parseFile(track.path).then((metadata) => {
          var stmt = this.db.prepare("SELECT * FROM CoverArt WHERE id = ?");
          var existingCover = stmt.all(coverId);

          if (existingCover.length === 0) {
            this.db.prepare("INSERT INTO CoverArt (id, album) VALUES (?, ?)").run(coverId, track.album);
          }

          if (metadata.common.picture) {

            fs.writeFile(coverFileOrig, metadata.common.picture[0].data, (err) => {
              if (err) {
                this.error(err);
              }

              jimp.read(coverFileOrig).then((image) => {

                image.resize(150, jimp.AUTO);
                image.writeAsync(coverFileThumb);
              });


              this.db.prepare("UPDATE Tracks SET cover_art=? WHERE id=?").run(coverId, track.id);
            });
          }
          return this.parseFiles(audioFiles); // process rest of the files AFTER we are finished
        });
      } return this.parseFiles(audioFiles);
    } else { return Promise.resolve(); }
  }

  createAlbumArt() {
    this.info("checking missing art");
    this.updateStatus("checking missing art", true);
    var allTracks = this.db.prepare("SELECT * FROM Tracks").all();
    return this.parseFiles(allTracks);
  }

  cleanup() {
    this.info("Starting cleanup");
    this.updateStatus("Cleanup", false);
    this.checkTracksExist();
    this.checkEmptyPlaylists();
    this.checkEmptyArtists();
    this.checkEmptyGenres();
    this.checkSortOrder();
    this.checkCounts();
    this.checkHistory();
    this.checkCache();
    this.info("Cleanup complete");
    this.updateStatus("Cleanup Complete", false);
  }

  incrementalCleanup() {
    if (this.isScanning()) {
      this.debug("scan in progress");
    } else {
      this.updateStatus("incremental Cleanup", true);
      this.info("incrementalCleanup");
      // this.cleanup();
      this.createAlbumArt().then(() => {
        this.info("Incremental Cleanup complete");
        this.updateStatus("Cleanup Complete", false);
      });
    }
  }

  lastFmScan() {
    this.lastfm.login(this.getLastFmOptions());
    this.filteredFiles = [];
    this.filteredFiles = this.db.prepare("SELECT * FROM Tracks WHERE id NOT IN (SELECT id FROM LastFM)").all();
    this.totalFiles = this.filteredFiles.length;
    this.checkLastFmStep();
  }

  processCacheTrack(settings, tracks) {

    var track = tracks.shift();
    if (track && !this.shouldCancel()) {
      var outputPath = path.join(process.env.CONVERTED_STARRED_MEDIA_DIR, path.basename(track.path, path.extname(track.path)) + "." + settings.alloydb_streaming_format.toLowerCase());
      if (!fs.existsSync(outputPath)) {
        this.convert(this.db, track, settings.alloydb_streaming_bitrate, settings.alloydb_streaming_format, outputPath, (command) => {
          this.debug(command);
        }, (progress) => {
          this.debug("Processing: " + progress.timemark + " done " + progress.targetSize + " kilobytes");
        }, (err) => {
          this.error(err);
        }, (returnPath) => {
          this.debug("Finished Conversion - " + returnPath);
          this.processCacheTrack(settings, tracks);
        });
      } else { this.processCacheTrack(settings, tracks); }
    } else {
      this.info("Caching tracks complete");
      this.updateStatus("Caching tracks complete", false);
    }
  }

  recache() {
    if (this.isScanning()) {
      this.debug("scan in progress");
    } else {
      this.updateStatus("Recaching Starred", true);
      this.info("Recache Starred");

      var settingsResult = this.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
      if (settingsResult && settingsResult.settings_value) {
        var settings = JSON.parse(settingsResult.settings_value);
        if (settings) {

          if (settings.alloydb_streaming_format === "Unchanged") {
            this.updateStatus("Recache Finished, Cannot use setting: Unchanged", false);
            this.info("Recache Finished, Cannot use setting: Unchanged");
            return;
          }
          var tracksToCache = [];
          var starredTracks = this.db.prepare("SELECT * FROM Tracks WHERE starred=?").all("true");
          var topTracks = this.db.prepare("SELECT * FROM Tracks WHERE starred=? ORDER BY play_count DESC LIMIT 25").all("true");
          var starredAlbums = this.db.prepare("SELECT * FROM Albums WHERE starred=?").all("true");
          var playlists = this.db.prepare("SELECT * FROM Playlists WHERE cache=?").all("true");


          topTracks.forEach((track) => {
            tracksToCache.push(track);
          });


          starredAlbums.forEach((album) => {
            album.tracks = this.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
            album.tracks.forEach((track) => {
              tracksToCache.push(track);
            });
          });


          starredTracks.forEach((track) => {
            tracksToCache.push(track);
          });


          var starredArtists = this.db.prepare("SELECT * FROM Artists WHERE starred=? ORDER BY name ASC").all("true");
          starredArtists.forEach((artist) => {
            starredArtists.tracks = this.db.prepare("SELECT * FROM Tracks WHERE artist_id=?").all(artist.id);
            starredArtists.albums = this.db.prepare("SELECT * FROM Albums WHERE artist_id=? ORDER BY name ASC").all(artist.id);
            artist.play_count = 0;
            starredArtists.albums.forEach((album) => {
              album.tracks = this.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
              album.tracks.forEach((track) => {
                tracksToCache.push(track);
              });
            });
          });

          playlists.forEach((playlist) => {
            playlist.tracks = this.db.prepare("SELECT * FROM PlaylistTracks WHERE id=?").all(playlist.id);

            playlist.tracks.forEach((playlistTrack) => {
              var track = this.db.prepare("SELECT * FROM Tracks WHERE id=?").all(playlistTrack.song_id);
              tracksToCache.push(track);
            });
          });

          this.processCacheTrack(settings, tracksToCache);
        }
      }
    }

  }

  writeDb(data, table) {
    var sql = "INSERT OR REPLACE INTO " + table + " (";
    var values = {};
    Object.keys(data).forEach((key, index) => {
      if (index === Object.keys(data).length - 1) { sql += key; }
      else { sql += key + ", "; }
    });


    sql += ") VALUES (";


    Object.keys(data).forEach((key, index) => {
      if (index === Object.keys(data).length - 1) { sql += "@" + key; }
      else { sql += "@" + key + ", "; }
    });

    sql += ")";

    try {
      var insert = this.db.prepare(sql);

      Object.keys(data).forEach((key, index) => {
        var a = {};
        a[key] = data[key];
        Object.assign(values, a);
      });

      insert.run(values);
    } catch (err) {
      if (err) {
        this.error(err);
      }
      this.error(sql);
      this.error(values);
    }
  }

  writeScanEvent(type, obj, reason, result) {
    try {
      var data = {
        event_type: type,
        reason,
        result,
        time: moment().unix(),
        path: obj.path,
        title: "",
        artist: "",
        artist_id: "",
        album: "",
        album_id: "",
        quality: "",
      };

      if (data.path && !fs.lstatSync(data.path).isDirectory()) {
        data.quality = mime.lookup(data.path);
      }

      switch (type) {
        case "insert-track":
        case "delete-track":
          data.artist = obj.artist;
          data.artist_id = obj.artist_id;
          data.album = obj.album;
          data.title = obj.title;
          data.album_id = obj.album_id;
          break;
        case "insert-album":
        case "delete-album":
          data.artist = obj.artist;
          data.artist_id = obj.artist_id;
          data.album = obj.name;
          data.title = obj.name;
          data.album_id = obj.id;
          break;
        case "insert-artist":
        case "delete-artist":
          data.artist = obj.name;
          data.artist_id = obj.id;
          break;
        case "insert-playlist":
        case "delete-playlist":
          data.title = obj.name;
          break;
        case "insert-genre":
        case "delete-genre":
          data.title = obj.name;
          break;
      }
      this.writeDb(data, "ScanEvents");
    } catch (err) {
      this.error(err);
    }
  }
};