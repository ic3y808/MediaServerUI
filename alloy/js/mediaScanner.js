const fs = require("fs");
const path = require("path");
const watch = require("node-watch");
const uuidv3 = require("uuid/v3");
const parser = require("xml2json");
const klawSync = require("klaw-sync");
const escape = require("escape-string-regexp");
const { ipcRenderer, remote } = require("electron");
var Queue = require("better-queue");
var utils = {};
var structures = {};
var MediaScannerBase = {};
var mm = {};
var watchers = [];
var scanner = {};

process.env = remote.getGlobal("process").env;
utils = require(path.join(process.env.APP_DIR, "common", "utils"));
structures = require(path.join(process.env.APP_DIR, "common", "structures"));
MediaScannerBase = require(path.join(process.env.APP_DIR, "alloy", "js", "MediaScannerBase"));
mm = require(path.join(process.env.APP_DIR, "alloyapi", "music-metadata"));

class MediaScanner extends MediaScannerBase {
  constructor() {
    super(require("better-sqlite3")(process.env.DATABASE));
    this.db.pragma("journal_mode = WAL");
    process.on("exit", () => {
      this.db.close();
    });
    process.on("SIGHUP", () => process.exit(128 + 1));
    process.on("SIGINT", () => process.exit(128 + 2));
    process.on("SIGTERM", () => process.exit(128 + 15));
    this.configureQueue();
    this.configFileWatcher();
    ipcRenderer.send("mediascanner-loaded-result", "success");
    this.info("Mediascanner Started");
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

  startScan() {
    if (this.shouldCancel()) {
      return;
    }
    if (this.isScanning()) {
      this.updateStatus("Scan in progress", true);
      this.info("Scan in progress");
    } else {
      this.resetStatus();
      this.updateStatus("Start Full Scan", true);
      var collectedArtistFolders = this.collectArtists();
      this.updateStatus("found mapped artists " + collectedArtistFolders.mappedArtists.length + " and unmapped artists " + collectedArtistFolders.unmappedArtists.length, true);
      this.debug("found mapped artists " + collectedArtistFolders.mappedArtists.length + " and unmapped artists " + collectedArtistFolders.unmappedArtists.length);
      collectedArtistFolders.mappedArtists.forEach((artist) => {
        this.tickets[artist.path] = this.queue.push(artist.path);
      });
    }
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

  async scanAlbum(artist, album) {

    if (this.shouldCancel()) { return; }
    this.updateStatus("Scanning Album ", true, { path: album.path });
    this.debug("Scanning Album " +  album.path);
    if (fs.existsSync(album.path)) {
      const albumTracks = klawSync(album.path, { nodir: true });

      for (const track of albumTracks) {
        try {
          if (utils.isFileValid(track.path)) {
            var metadata = await mm.parseFile(track.path);
            var processed_track = new structures.Song();
            processed_track = this.checkExistingTrack(processed_track, metadata);
            processed_track.path = track.path;
            processed_track.artist = utils.isStringValid(artist.name, "");
            processed_track.artist_id = artist.id;
            processed_track.album = utils.isStringValid(album.name, "");
            processed_track.album_path = album.path;
            processed_track.getStats();

            processed_track.album_id = album.id;

            album.releases.forEach((release) => {
              if (release.Tracks) {
                release.Tracks.forEach((albumTrack) => {
                  if (!processed_track.id) {
                    var msCompare = processed_track.duration === parseInt(albumTrack.DurationMs / 1000, 10);
                    var tracknumCompare = processed_track.no === albumTrack.TrackPosition;
                    var mediumCompare = processed_track.of === release.TrackCount;

                    if (msCompare && tracknumCompare && mediumCompare) {
                      processed_track.id = albumTrack.RecordingId;
                      processed_track.title = albumTrack.TrackName;
                    }
                  } else if (processed_track.id === albumTrack.RecordingId) {
                    processed_track.title = albumTrack.TrackName;
                  }
                });
              }
            });

            processed_track = this.checkAlbumArt(processed_track, metadata);

            this.writeDb(processed_track, "Tracks");
            this.writeScanEvent("insert-track", processed_track, "Inserted mapped track", "success");

          }
        } catch (err) {
          this.error(err);
          this.writeScanEvent("insert-track", track, "Failed to insert mapped track", "failed");
        }
      }
    }
  }

  async scanArtist(dir) {

    if (this.shouldCancel()) { return; }
    this.updateStatus("Scanning Artist ", true, { path: dir });
    this.debug("Scanning Artist " + dir);
    var mappedArtist = await this.getArtist(dir);

    try {
      if (mappedArtist) {
        var albums = await this.getArtistAlbums(mappedArtist);

        for (const album of albums) {
          this.scanAlbum(mappedArtist, album);
        }
      }
    } catch (err) {
      this.error(err);
    }
  }

  async scanPath(dir) {
    try {
      if (fs.existsSync(dir)) {
        if (this.isAlbumDir(dir)) {
          var parent = path.dirname(dir);
          var mappedArtist = await this.getArtist(parent);
          var mappedAlbum = await this.getAlbum(mappedArtist, dir);
          await this.scanAlbum(mappedArtist, mappedAlbum);
        } else if (this.isArtistDir(dir)) {
          await this.scanArtist(dir);
        }
      }
    } catch (err) {
      this.error(err);
    }
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
}

ipcRenderer.on("mediascanner-scan-start", () => {
  scanner.startScan();
});

ipcRenderer.on("mediascanner-scan-cancel", () => {
  scanner.cancelScan();
});

ipcRenderer.on("mediascanner-cleaup-start", () => {
  scanner.cleanup();
});

ipcRenderer.on("mediascanner-inc-cleaup-start", () => {
  scanner.incrementalCleanup();
});

ipcRenderer.on("mediascanner-watcher-configure", () => {
  scanner.configFileWatcher();
});

ipcRenderer.on("mediascanner-recache-start", () => {
  scanner.recache();
});

ipcRenderer.on("mediascanner-lastfm-scan-start", () => {
  scanner.lastFmScan();
});

scanner = new MediaScanner();