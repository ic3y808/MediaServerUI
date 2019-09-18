const fs = require("fs");
const path = require("path");
const klawSync = require("klaw-sync");
const { ipcRenderer, remote } = require("electron");
var utils = {};
var structures = {};
var MediaScannerBase = {};
var mm = {};
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

  async scanAlbum(artist, album) {

    if (this.shouldCancel()) { return; }
    this.updateStatus("Scanning Album ", true, { path: album.path });
    if (fs.existsSync(album.path)) {
      const albumTracks = klawSync(album.path, { nodir: true });
      for (var index = 0; index < albumTracks.length; index++) {
        var track = albumTracks[index];
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
        for (var i = 0; i < albums.length; i++) {
          var album = albums[i];
          await this.scanAlbum(mappedArtist, album);
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