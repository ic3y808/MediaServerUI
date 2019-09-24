const _ = require("lodash");
const moment = require("moment");
const path = require("path");
const mime = require("mime-types");
const uuidv3 = require("uuid/v3");
const klawSync = require("klaw-sync");
const fs = require("fs");
const del = require("del");
const shell = require("shelljs");
const jimp = require("jimp");
const parser = require("xml2json");
const watch = require("node-watch");
var Queue = require("better-queue");
//const escape = require("escape-string-regexp");

const { ipcRenderer } = require("electron");
var loggerTag = "MediaScannerBase";
var LastFM = require(path.join(process.env.APP_DIR, "common", "simple-lastfm"));
var utils = require(path.join(process.env.APP_DIR, "common", "utils"));
var watchers = [];

module.exports = class MediaScannerBase {

  constructor(database) {
    this.db = database;
    this.resetStatus();
    this.queue = {};
    this.lastfm_queue = {};
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

  abortQueue() {
    if (this.queue._tickets) {
      var keys = Object.keys(this.queue._tickets);
      keys.forEach((key) => {
        this.queue.cancel(key);
      });
    }
  }

  cancelScan() {
    if (this.isScanning()) {
      this.updateStatus("Cancelling scan", false);
      this.info("Cancelling scan");
      this.scanStatus.shouldCancel = true;
      this.abortQueue();
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

      if (this.tickets && Object.keys(this.tickets).length > 0) {
        var ticketKeys = Object.keys(this.tickets);

        ticketKeys.forEach((key) => {
          if (this.tickets[key].isFinished === true || this.tickets[key].isFinished === "true") {
            delete this.tickets[key];
          }
        });
        this.scanStatus.queue = this.tickets;
      }
    }
  }

  getStatus() {
    return this.scanStatus;
  }

  configureQueue() {
    this.queue = new Queue(async (input, cb) => {
      if (this.shouldCancel()) {
        cb(null, null);
      } else {
        await this.scanPath(input);
        this.checkQueue();
        cb(null, null);
      }
    }, {
      concurrent: 1,
      id: function (task, cb) {
        // Compute the ID
        cb(null, task);
      }
    });

    this.queue.on("batch_finish", () => {
      this.checkQueue();
      if (Object.keys(this.tickets).length > 0) { return; }
      this.db.checkpoint();
      this.cleanup();
      this.resetStatus();
      this.updateStatus("Scan Complete", false);
      ipcRenderer.send("system-get-stats");
    });
  }

  configFileWatcher() {
    watchers.forEach((watcher) => {
      if (!watcher.isClosed()) {
        watcher.close();
      }
    });
    watchers = [];

    var mediaPaths = this.db.prepare("SELECT * FROM MediaPaths").all();

    if (mediaPaths.length === 0) {
      this.info("No Media Path Defined ");
      return;
    }
    mediaPaths.forEach((mediaPath) => {
      if (mediaPath.path && fs.existsSync(mediaPath.path)) {
        watchers.push(watch(mediaPath.path, { recursive: true }, (evt, name) => {
          var fileName = name;
          if (fs.existsSync(fileName)) {
            if (fs.lstatSync(fileName).isDirectory()) {

              this.tickets[fileName] = this.queue.push(fileName);
            }
            else {
              this.tickets[path.dirname(fileName)] = this.queue.push(path.dirname(fileName));
            }
          }
        }));
      }
    });
  }

  checkDBArtistExists(artist) {
    var stmt = this.db.prepare("SELECT * FROM Artists WHERE id = ?");
    var existingArtist = stmt.all(artist.id);
    if (existingArtist.length === 0) {
      const artistTracks = klawSync(artist.path, { nodir: true });
      var validTracks = [];
      artistTracks.forEach((track) => {
        if (utils.isFileValid(track.path)) {
          validTracks.push(track);
        }
      });
      artist.track_count = validTracks.length;
      this.writeDb(artist, "Artists");
      this.writeScanEvent("insert-artist", artist, "Inserted mapped artist", "success");
      this.updateStatus("Inserted mapped artist " + artist.name, true);
    }
  }

  checkDBGenreExist(track) {
    try {
      var genre = track.genre.split("/");

      if (genre.length > 0) {
        track.genre = genre[0];
      }
      track.tags = "";

      for (var i = 1; i < genre.length; i++) {
        track.tags += genre[i];
        if (i < genre.length - 1) { track.tags += "|"; }
      }

      var tempGenreId = "genre_" + uuidv3(track.genre, process.env.UUID_BASE).split("-")[0];
      var existingGenre = this.db.prepare("SELECT * FROM Genres WHERE id = ? OR name = ?").all(tempGenreId, track.genre);
      if (existingGenre.length === 0) {
        track.genre_id = tempGenreId;
        var stmt = this.db.prepare("INSERT INTO Genres (id, name) VALUES (?,?)");
        var info = stmt.run(track.genre_id, track.genre);
      } else {
        track.genre_id = existingGenre[0].id;
      }
    } catch (err) {
      this.error(err);
    }
    return track;
  }

  checkExistingTrack(track, metadata) {
    track.id = utils.isStringValid(metadata.common.musicbrainz_recordingid, "");

    var existingDbTrack = this.db.prepare("SELECT * FROM Tracks WHERE id = ?").get(track.id);

    if (existingDbTrack) {
      Object.assign(track, existingDbTrack);
    }
    track.artist = utils.isStringValid(metadata.common.artist, "No Artist");
    track.title = utils.isStringValid(metadata.common.title, "");
    track.album = utils.isStringValid(metadata.common.album, "No Album");


    track.genre = utils.isStringValid((metadata.common.genre !== undefined && metadata.common.genre[0] !== undefined && metadata.common.genre[0] !== "") ? metadata.common.genre[0] : "No Genre");
    this.checkDBGenreExist(track);

    track.bpm = utils.isStringValid(metadata.common.bpm, "");
    track.year = metadata.common.year;
    track.suffix = utils.isStringValid(metadata.common.suffix, "");
    track.no = metadata.common.track.no;
    track.of = metadata.common.track.of;
    return track;
  }

  checkAlbumArt(track, metadata) {
    if (metadata.common.picture) {

      var coverId = "cvr_" + track.album_id;
      var coverFile = path.join(process.env.COVER_ART_DIR, coverId + ".jpg");

      var stmt = this.db.prepare("SELECT * FROM CoverArt WHERE id = ?");
      var existingCover = stmt.all(coverId);

      if (existingCover.length === 0) {
        this.db.prepare("INSERT INTO CoverArt (id, album) VALUES (?, ?)").run(coverId, track.album);
      }

      track.cover_art = coverId;

      if (!fs.existsSync(coverFile)) {
        var data = metadata.common.picture[0].data;
        if (data) {
          fs.writeFile(coverFile, data, function (err) {
            if (err) {
              this.error(err);
            }
          });
        }
      }
    }
    return track;
  }

  collectArtists() {
    var mediaPaths = this.db.prepare("SELECT * FROM MediaPaths").all();

    if (mediaPaths.length === 0) {
      this.updateStatus("No Media Path Defined ", false);
      return null;
    }
    this.updateStatus("Collecting mapped and unmapped artist folders", true);
    this.debug("Collecting mapped and unmapped artist folders");

    var mappedArtistDirectories = [];
    var unmappedArtistDirectories = [];

    mediaPaths.forEach((mediaPath) => {
      const artistDirs = klawSync(mediaPath.path, { nofile: true, depthLimit: 0 });

      artistDirs.forEach((dir) => {
        if (fs.existsSync(path.join(dir.path, process.env.ARTIST_NFO))) {
          mappedArtistDirectories.push({
            path: dir.path
          });
        } else {
          unmappedArtistDirectories.push({
            path: dir.path
          });
        }
      });
    });

    return {
      mappedArtists: mappedArtistDirectories,
      unmappedArtists: unmappedArtistDirectories
    };
  }

  checkDBLinks(artist) {
    if (artist && artist.links) {
      artist.links.forEach((link) => {
        var existingLink = this.db.prepare("SELECT * FROM Links WHERE type=? AND target=? AND artist_id=?").all(link.type, link.target, artist.id);
        if (existingLink.length === 0) {
          link.artist_id = artist.id;
          this.writeDb(link, "Links");
        }
      });
    }
  }

  async getArtist(dir) {
    if (!fs.existsSync(path.join(dir, process.env.ARTIST_NFO))) { return null; }
    var data = fs.readFileSync(path.join(dir, process.env.ARTIST_NFO));
    var json = JSON.parse(parser.toJson(data));
    var artistUrl = process.env.BRAINZ_API_URL + "/api/v0.4/artist/" + json.artist.musicbrainzartistid;
    var result = await this.downloadPage(artistUrl);
    var artistInfo = JSON.parse(result);
    if (artistInfo.error) {
      this.updateStatus("Failed, " + artistInfo.error + " " + artistUrl, true);
      return null;
    } else {
      this.checkDBLinks(artistInfo);
      var mappedArtist = {
        id: artistInfo.id,
        name: utils.isStringValid(artistInfo.artistname, ""),
        biography: JSON.parse(JSON.stringify((utils.isStringValid(artistInfo.overview, "")))),
        status: utils.isStringValid(artistInfo.status, ""),
        rating: artistInfo.rating.count,
        type: utils.isStringValid(artistInfo.type, ""),
        disambiguation: utils.isStringValid(artistInfo.disambiguation, ""),
        overview: JSON.parse(JSON.stringify((utils.isStringValid(artistInfo.overview, ""))))
      };
      mappedArtist.path = dir;
      this.checkDBArtistExists(mappedArtist);
      return mappedArtist;
    }
  }

  async getAlbum(artist, dir) {
    if (!fs.existsSync(path.join(dir, process.env.ALBUM_NFO))) { return null; }
    this.debug("Scanning Album " + dir);
    var json = JSON.parse(parser.toJson(fs.readFileSync(path.join(dir, process.env.ALBUM_NFO))));
    var albumUrl = process.env.BRAINZ_API_URL + "/api/v0.4/album/" + json.album.musicbrainzalbumid;
    const albumTracks = klawSync(dir, { nodir: true });
    var validTracks = [];
    albumTracks.forEach((track) => {
      if (utils.isFileValid(track.path)) {
        validTracks.push(track);
      }
    });
    var result = await this.downloadPage(albumUrl);
    var albumInfo = JSON.parse(result);
    if (albumInfo.error) {
      this.updateStatus("Failed, " + albumInfo.error + " " + albumUrl, true);
      return null;
    } else {
      if (albumInfo) {
        var mappedAlbum = {
          id: json.album.musicbrainzalbumid,
          artist: utils.isStringValid(artist.name, ""),
          artist_id: artist.id,
          name: utils.isStringValid(albumInfo.title, ""),
          path: dir,
          created: json.album.releasedate,
          type: utils.isStringValid(albumInfo.type, ""),
          rating: albumInfo.Rating ? albumInfo.rating.Count : 0,
          track_count: validTracks.length
        };
        var stmt = this.db.prepare("SELECT * FROM Albums WHERE id = ?");
        var existingAlbum = stmt.get(mappedAlbum.id);
        if (!existingAlbum) {
          this.writeDb(mappedAlbum, "Albums");
          this.writeScanEvent("insert-album", mappedAlbum, "Inserted mapped album", "success");
          this.updateStatus("Inserted mapped album " + mappedAlbum.name, true);
        } else {
          mappedAlbum = Object.assign(existingAlbum, mappedAlbum);
          this.writeDb(mappedAlbum, "Albums");
          this.writeScanEvent("update-album", mappedAlbum, "Updated mapped album", "success");
          this.updateStatus("Updated mapped album " + mappedAlbum.name, true);
        }

        mappedAlbum.releases = [];
        if (albumInfo.releases) {
          albumInfo.releases.forEach((release) => {
            mappedAlbum.releases.push(release);
          });
        }
        return mappedAlbum;
      }
    }
  }

  async getArtistAlbums(artist) {
    const albumDirs = klawSync(artist.path, {
      nofile: true
    });
    var mappedAlbums = [];
    for (let index = 0; index < albumDirs.length; index++) {
      var mappedAlbum = await this.getAlbum(artist, albumDirs[index].path);
      if (mappedAlbum) { mappedAlbums.push(mappedAlbum) }
    }
    return mappedAlbums;
  }

  isScanning() {
    return this.scanStatus.isScanning;
  }

  isArtistDir(dir) {
    return fs.existsSync(path.join(dir, process.env.ARTIST_NFO));
  }

  isAlbumDir(dir) {
    var parent = path.dirname(dir);
    var mediaPaths = this.db.prepare("SELECT * FROM MediaPaths").all();
    var isAlbum = true;
    mediaPaths.forEach((mediaPath) => {
      if (parent === mediaPath.path) { isAlbum = false; }
    });
    if (isAlbum === false) { return false; }
    else {
      return fs.existsSync(path.join(dir, process.env.ALBUM_NFO));
    }
  }

  downloadPage(url, method = "GET") {
    return new Promise((resolve, reject) => {
      resolve(ipcRenderer.sendSync("web-request", { url: url, method: method }));
    });
  }

  checkCounts() {
    this.info("checking counts");
    this.updateStatus("checking counts", true);

    var genreCounts = this.db.prepare("SELECT genre_id as id, count(*) as track_count, count(distinct Tracks.artist_id) as artist_count, count(distinct Tracks.album_id) as album_count, sum(Tracks.play_count) as plays FROM Tracks INNER JOIN Genres ON Genres.id = Tracks.genre_id group by genre_id").all();
    genreCounts.forEach((g) => {
      this.db.prepare("UPDATE Genres SET track_count=?, artist_count=?, album_count=?, play_count=? WHERE id=?").run(g.track_count, g.artist_count, g.album_count, g.plays, g.id);
    })

    var albumCounts = this.db.prepare("SELECT album_id as id, count(*) as track_count, sum(Tracks.play_count) as plays FROM Tracks INNER JOIN Albums ON Albums.id = Tracks.album_id group by album_id").all();

    albumCounts.forEach((album) => {
      this.db.prepare("UPDATE Albums SET track_count=?, play_count=? WHERE id=?").run(album.track_count, album.plays, album.id);
    });
  }

  checkEmptyArtists() {
    this.info("checking empty artists");
    this.updateStatus("checking missing media", true);
    var allMedia = this.db.prepare("SELECT id FROM Artists WHERE id NOT IN (SELECT artist_id FROM Tracks)").all();
    allMedia.forEach((artist) => {
      this.db.prepare("DELETE FROM Artists WHERE id=?").run(artist.id);
      this.writeScanEvent("delete-artist", artist, "Deleted mapped artist because it was empty", "success");
    });
  }

  checkEmptyAlbums() {
    this.info("checking empty albums");
    this.updateStatus("checking missing albums", true);
    var allMedia = this.db.prepare("SELECT id FROM Albums WHERE id NOT IN (SELECT album_id FROM Tracks)").all();
    allMedia.forEach((album) => {
      this.db.prepare("DELETE FROM Albums WHERE id=?").run(album.id);
      this.writeScanEvent("delete-album", album, "Deleted mapped album because it was empty", "success");
    });
  }

  checkEmptyGenres() {
    this.info("checking empty genres");
    this.updateStatus("checking empty genres", true);
    var allMedia = this.db.prepare("SELECT id FROM Genres WHERE id NOT IN (SELECT genre_id FROM Tracks)").all();
    allMedia.forEach((genre) => {
      this.db.prepare("DELETE FROM Genres WHERE id=?").run(genre.id);
      this.writeScanEvent("delete-genre", genre, "Deleted mapped genre because it was empty", "success");
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

  parseAlbumArt(audioFiles) {
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
          return this.parseAlbumArt(audioFiles); // process rest of the files AFTER we are finished
        });
      } return this.parseAlbumArt(audioFiles);
    } else { return Promise.resolve(); }
  }

  createAlbumArt() {
    this.info("checking missing art");
    this.updateStatus("checking missing art", true);
    var allTracks = this.db.prepare("SELECT * FROM Tracks").all();
    return this.parseAlbumArt(allTracks);
  }

  cleanup() {
    this.info("Starting cleanup");
    this.updateStatus("Cleanup", false);
    this.checkTracksExist();
    this.checkEmptyPlaylists();
    this.checkEmptyArtists();
    this.checkEmptyGenres();
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

  checkLastFmStep() {
    if (this.scanStatus.shouldCancel) {
      this.updateStatus("Scanning Cancelled", false);
      setTimeout(() => {
        this.resetStatus();
      }, 5000);
      return;
    }

    if (Object.keys(this.lastfm_queue).length === 0) {
      this.updateStatus("Scanning Complete", false);
      setTimeout(() => {
        this.resetStatus();
      }, 5000);
      return;
    }

    var item = this.lastfm_queue.shift();
    if (!item || !item.type) {
      this.updateStatus("Scanning Complete", false);
    } else {
      try {
        this.getLastfmSession(() => {

          switch (item.type) {
            case "artist":
              var artist = item.data;
              this.updateStatus("Scanning Artist " + artist.name, true);
              this.lastfm.getArtistInfo({
                artist: artist.name,
                mbid: artist.musicbrainz_artistid,
                callback: (result) => {
                  if (result && result.artistInfo) {
                    var data = JSON.stringify(result.artistInfo);
                    var entry = { id: artist.id, type: "artist", data: data };

                    this.writeDb(entry, "LastFM");

                    var updateArtist = false;
                    if (result.artistInfo.bio) {
                      if (result.artistInfo.bio.summary) {
                        artist.overview = JSON.parse(JSON.stringify(utils.isStringValid(result.artistInfo.bio.summary.replace(/\<.*apply\./gi, ""), "")));
                        updateArtist = true;
                      }
                      if (result.artistInfo.bio.content) {
                        artist.biography = JSON.parse(JSON.stringify(utils.isStringValid(result.artistInfo.bio.content, "").replace(/\<.*apply\./gi, "")));
                        updateArtist = true;
                      }
                    }
                    if (result.artistInfo.stats) {
                      if (result.artistInfo.stats.userplaycount !== "0") {
                        artist.play_count = parseInt(result.artistInfo.stats.userplaycount, 10);
                        updateArtist = true;
                      }
                    }
                    if (updateArtist) {
                      this.writeDb(artist, "Artists");
                    }
                  }
                  this.checkLastFmStep();
                }
              });
              break;
            case "album":
              var album = item.data;
              this.updateStatus("Scanning Album " + album.name, true);
              this.lastfm.getAlbumInfo({
                artist: album.artist,
                album: album.name,
                mbid: album.musicbrainz_artistid,
                callback: (result) => {
                  if (result && result.albumInfo) {
                    var data = JSON.stringify(result.albumInfo);
                    var entry = { id: album.id, type: "album", data: data };

                    this.writeDb(entry, "LastFM");

                    var updateAlbum = false;


                    if (result.albumInfo.userplaycount !== "0") {
                      album.play_count = parseInt(result.albumInfo.userplaycount, 10);
                      updateAlbum = true;
                    }

                    if (updateAlbum) {
                      this.writeDb(album, "Albums");
                    }
                  }
                  this.checkLastFmStep();
                }
              });
              break;
            case "track":
              var track = item.data;
              this.updateStatus("Scanning Track " + track.path, true);
              this.lastfm.getTrackInfo({
                artist: track.artist === "No Artist" ? track.base_path : track.artist,
                track: track.title,
                mbid: track.musicbrainz_artistid,
                callback: (result) => {
                  if (result && result.trackInfo) {
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
                  }
                  this.checkLastFmStep();
                }
              });
              break;
          }


        });
      } catch (err) {
        this.updateStatus("Scanning Error " + err.message, false);
        if (Object.keys(this.lastfm_queue).length > 0) { this.step(); }
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

  lastFmScan() {
    if (this.isScanning()) {
      this.debug("scan in progress");
    } else {
      this.lastfm.login(this.getLastFmOptions());
      this.lastfm_queue = [];

      var starred = this.db.prepare("SELECT * FROM Tracks WHERE starred=?").all("true");
      starred.forEach((track) => {
        this.getLastfmSession(() => {
          this.lastfm.loveTrack({
            artist: track.artist,
            track: track.title,
            callback: (result) => {
              if (!result.error) {
                //this.debug("lastfm love track " + track.title + " - " + track.artist);
              }
            }
          });
        });
      });

      var artists = this.db.prepare("SELECT * FROM Artists WHERE id NOT IN (SELECT id FROM LastFM) ORDER BY name ASC").all();
      artists.forEach((artist) => {
        this.lastfm_queue.push({ type: "artist", data: artist });
      });

      var albums = this.db.prepare("SELECT * FROM Albums WHERE id NOT IN (SELECT id FROM LastFM) ORDER BY artist ASC").all();
      albums.forEach((album) => {
        this.lastfm_queue.push({ type: "album", data: album });
      });

      var tracks = this.db.prepare("SELECT * FROM Tracks WHERE id NOT IN (SELECT id FROM LastFM) ORDER BY artist ASC").all();
      tracks.forEach((track) => {
        this.lastfm_queue.push({ type: "track", data: track });
      });

      this.checkLastFmStep();
    }
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