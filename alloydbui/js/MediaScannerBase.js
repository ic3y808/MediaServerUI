const moment = require("moment");
const path = require("path");
const mime = require("mime-types");
const fs = require("fs");
const _ = require("lodash");
const del = require("del");
var http = require("http");
const { ipcRenderer } = require("electron");
const mm = require(path.join(process.env.APP_DIR, "alloydbapi", "music-metadata"));

module.exports = class MediaScannerBase {

  constructor(database) {
    this.db = database;
    this.resetStatus();
  }


  error(data) { ipcRenderer.send("error", { source: "MediaScanner", data: data }); }
  debug(data) { ipcRenderer.send("debug", { source: "MediaScanner", data: data }); }
  log(data) { ipcRenderer.send("log", { source: "MediaScanner", data: data }); }
  info(data) { ipcRenderer.send("info", { source: "MediaScanner", data: data }); }

  shouldCancel() {
    if (this.scanStatus.shouldCancel) {
      this.updateStatus("Scanning Cacelled", false);
      return true;
    }
    return false;
  }

  cancelScan() {
    if (this.isScanning()) {
      this.scanStatus.shouldCancel = true;
      this.updateStatus("Starting cancel", false);
      this.info("Starting cancel scan");
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
    Object.assign(opts, this.scanStatus);
    ipcRenderer.send("mediascanner-status", opts);
    this.info(JSON.stringify(opts));
  }

  getStatus() {
    return this.scanStatus;
  }

  isScanning() {
    return this.scanStatus.isScanning;
  }

  dl(url) {
    return new Promise((resolve, reject) => {

    });
  }

  downloadPage(url, method = "GET") {
    return new Promise((resolve, reject) => {
      resolve(ipcRenderer.sendSync("web-request", { url: url, method: method }));
    });
  }

  checkCounts() {
    this.info("checking counts");
    this.updateStatus("checking counts", true);
    var genres = this.db.prepare("SELECT * FROM Genres").all();
    genres.forEach((g) => {
      var albums = [];
      var artists = [];
      var tracks = this.db.prepare("SELECT * FROM Tracks WHERE genre_id=?").all(g.id);
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
          if (err) { this.error(JSON.stringify(err)); }
          this.info(sql);
        }
      }
    });
  }

  parseFiles(audioFiles) {
    if (this.scanStatus.shouldCancel) { return Promise.resolve(); }
    const track = audioFiles.shift();

    if (track) {
      //this.updateStatus("Collecting album art ", true, track.path);
      var coverId = "cvr_" + track.album_id;
      var coverFile = path.join(process.env.COVER_ART_DIR, coverId + ".jpg");

      var stmt = this.db.prepare("SELECT * FROM CoverArt WHERE id = ?");
      var existingCover = stmt.all(coverId);
      if (!fs.existsSync(coverFile)) {
        return mm.parseFile(track.path).then((metadata) => {
          if (existingCover.length === 0) {
            this.db.prepare("INSERT INTO CoverArt (id, album) VALUES (?, ?)").run(coverId, track.album);
          }

          if (metadata.common.picture) {

            fs.writeFile(coverFile, metadata.common.picture[0].data, (err) => {
              if (err) {
                this.error(JSON.stringify(err));
              }
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
      if (err) { this.error(JSON.stringify(err)); }
      this.info(sql);
      this.info(values);
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
      this.info(JSON.stringify(err));
    }
  }
};

