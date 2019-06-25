const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const watch = require("node-watch");
const uuidv3 = require("uuid/v3");
const parser = require("xml2json");
const klawSync = require("klaw-sync");
const { ipcRenderer } = require("electron");
var utils = {};
var structures = {};
var MediaScannerBase = {};
var mm = {};
var watchers = [];
var currentQueue = [];
var scanner = {};

ipcRenderer.on("mediascanner-start", (args, env) => {
  process.env = env;
  utils = require(path.join(process.env.APP_DIR, "common", "utils"));
  structures = require(path.join(process.env.APP_DIR, "common", "structures"));
  MediaScannerBase = require(path.join(process.env.APP_DIR, "alloydbui", "js", "MediaScannerBase"));
  mm = require(path.join(process.env.APP_DIR, "alloydbapi", "music-metadata"));


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
      this.configFileWatcher();
    }

    startScan() {
      if (this.isScanning()) {
        this.updateStatus("Scan in progress", true);
        this.info("Scan in progress");
      } else {
        this.info("Start Full Scan");
        var collectedArtistFolders = this.collectArtists();
        this.updateStatus("found mapped artists " + collectedArtistFolders.mappedArtists.length + " and unmapped artists " + collectedArtistFolders.unmappedArtists.length, true);
        this.scanArtists(collectedArtistFolders.mappedArtists);
      }
    }

    checkDBLinks(artist) {
      if (artist && artist.Links) {
        artist.Links.forEach((link) => {
          var existingLink = this.db.prepare("SELECT * FROM Links WHERE type=? AND target=? AND artist_id=?").all(link.type, link.target, artist.Id);
          if (existingLink.length === 0) {
            link.artist_id = artist.Id;
            this.writeDb(link, "Links");
          }
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

    checkDBAlbumsExist(artist) {
      return new Promise((resolve, reject) => {
        const albumDirs = klawSync(artist.path, {
          nofile: true
        });
        var mappedAlbums = [];
        var promises = [];
        albumDirs.forEach((dir) => {
          if (fs.existsSync(path.join(dir.path, process.env.ALBUM_NFO))) {
            var json = JSON.parse(parser.toJson(fs.readFileSync(path.join(dir.path, process.env.ALBUM_NFO))));
            var albumUrl = process.env.BRAINZ_API_URL + "/api/v0.4/album/" + json.album.musicbrainzalbumid;
            const albumTracks = klawSync(dir.path, { nodir: true });
            var validTracks = [];
            albumTracks.forEach((track) => {
              if (utils.isFileValid(track.path)) {
                validTracks.push(track);
              }
            });
            var albumPromise = this.downloadPage(albumUrl);
            promises.push(albumPromise);
            albumPromise.then((result) => {
              var albumInfo = JSON.parse(result);
              if (albumInfo) {
                var mappedAlbum = {
                  id: json.album.musicbrainzalbumid,
                  artist: utils.isStringValid(artist.name, ""),
                  artist_id: artist.id,
                  name: utils.isStringValid(albumInfo.title, ""),
                  path: dir.path,
                  created: json.album.releasedate,
                  type: utils.isStringValid(albumInfo.type, ""),
                  rating: albumInfo.Rating ? albumInfo.rating.Count : 0,
                  track_count: validTracks.length
                };
                var stmt = this.db.prepare("SELECT * FROM Albums WHERE id = ?");
                var existingAlbum = stmt.all(mappedAlbum.id);
                if (existingAlbum.length === 0) {
                  this.writeDb(mappedAlbum, "Albums");
                  this.writeScanEvent("insert-album", mappedAlbum, "Inserted mapped album", "success");
                  this.updateStatus("Inserted mapped album " + mappedAlbum.name, true);
                }
                mappedAlbum.releases = [];
                if (albumInfo.releases) {
                  albumInfo.releases.forEach((release) => {
                    mappedAlbum.releases.push(release);
                  });
                }
                mappedAlbums.push(mappedAlbum);
              }
            });
          }
        });

        Promise.all(promises).then(() => {
          resolve(mappedAlbums);
        });
      });
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
        this.error(JSON.stringify(err));
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
                this.error(JSON.stringify(err));
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

      var mappedArtistDirectories = [];
      var unmappedArtistDirectories = [];

      mediaPaths.forEach((mediaPath) => {
        if (this.shouldCancel()) {
          return {
            mappedArtists: mappedArtistDirectories,
            unmappedArtists: unmappedArtistDirectories
          };
        }

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

    scanArtist(artist) {
      return new Promise((resolve, reject) => {
        if (this.shouldCancel()) { return; }
        this.updateStatus("Scanning artist ", true, { path: artist.path });
        if (!fs.existsSync(path.join(artist.path, process.env.ARTIST_NFO))) { return; }
        var data = fs.readFileSync(path.join(artist.path, process.env.ARTIST_NFO));
        var json = JSON.parse(parser.toJson(data));
        var artistUrl = process.env.BRAINZ_API_URL + "/api/v0.4/artist/" + json.artist.musicbrainzartistid;
        var loaded = false;
        this.downloadPage(artistUrl).then((result) => {
          try {
            var artistInfo = JSON.parse(result);
            if (artistInfo.error) {
              this.updateStatus("Failed, " + artistInfo.error + " " + artistUrl, true);
              resolve();
            } else {
              this.checkDBLinks(artistInfo);
              var mappedArtist = {
                id: json.artist.musicbrainzartistid,
                name: utils.isStringValid(json.artist.title, ""),
                sort_name: utils.isStringValid(artistInfo.sortName, ""),
                biography: utils.isStringValid(json.artist.biography, ""),
                status: utils.isStringValid(artistInfo.status, ""),
                rating: artistInfo.rating.count,
                type: utils.isStringValid(artistInfo.type, ""),
                disambiguation: utils.isStringValid(artistInfo.disambiguation, ""),
                overview: utils.isStringValid(artistInfo.overview, "")
              };

              Object.assign(artist, mappedArtist);
              this.checkDBArtistExists(artist);
              this.checkDBAlbumsExist(artist).then((albums) => {
                var allMetaPromises = [];
                albums.forEach((album) => {

                  if (fs.existsSync(album.path)) {
                    const albumTracks = klawSync(album.path, { nodir: true });


                    albumTracks.forEach((track) => {
                      try {
                        if (utils.isFileValid(track.path)) {
                          this.debug("Scanning " + track.path);
                          var m = mm.parseFile(track.path).then((metadata) => {
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
                            this.updateStatus("Scanning track ", true, { path: track.path });
                          });
                          if (m) { allMetaPromises.push(m); }
                        }
                      } catch (err) {
                        this.error(err.message);
                        this.writeScanEvent("insert-track", track, "Failed to insert mapped track", "failed");
                      }
                    });
                  }
                });

                Promise.all(allMetaPromises).then(() => {
                  this.updateStatus("finished scanning albums from " + artist.name, true);
                  resolve();
                });
              });
            }
          } catch (err) {
            this.error(JSON.stringify(err.message));
          }

        }, (reason) => {
          this.updateStatus("Failed to fetch URL " + reason + " " + artistUrl, true);
          resolve();
        });
        // eslint-disable-next-line no-unmodified-loop-condition
      });
    }

    scanArtists(artists) {
      const artist = artists.shift();

      if (artist && !this.shouldCancel()) {
        this.scanArtist(artist).then(() => {
          this.scanArtists(artists);
        });

      } else {
        this.db.checkpoint();
        this.resetStatus();
        this.updateStatus("Scan Complete", false);
      }
    }

    scanPath(dir) {
      if (this.isScanning()) {
        this.updateStatus("Scan in progress", true);
        this.info("scan in progress");
        return;
      }
      try {
        if (fs.existsSync(dir)) {

          var pathToCheck = dir;
          if (!fs.lstatSync(dir).isDirectory()) { pathToCheck = path.dirname(dir); }

          if (fs.existsSync(path.join(pathToCheck, process.env.ARTIST_NFO))) {
            this.scanArtist({ path: pathToCheck }).then(() => {
              this.db.checkpoint();
              this.resetStatus();
              this.updateStatus("Scan Complete", false);
            });
          } else if (fs.existsSync(path.join(pathToCheck, process.env.ALBUM_NFO))) {
            this.scanArtist({ path: path.dirname(pathToCheck) }).then(() => {
              this.db.checkpoint();
              this.resetStatus();
              this.updateStatus("Scan Complete", false);
              this.cleanup();
            });
          }
        } else {
          this.updateStatus("Scan Complete", false);
        }
      } catch (err) {
        this.updateStatus("Scan Complete", false);
      }
    }

    startQueue(event) {
      clearTimeout(this.timeout);
      currentQueue.push(event);
      this.timeout = setTimeout(() => {
        var queue = _.uniq(currentQueue, "name");
        currentQueue = [];
        for (var i = queue.length - 1; i >= 0; --i) {
          this.scanPath(queue[i].path);
          queue.splice(i, 1);
        }
        clearTimeout(this.timeout);
      }, 5000);
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
              if (fs.lstatSync(fileName).isDirectory()) { this.startQueue({ evt: evt, name: fileName, path: fileName }); }
              else { this.startQueue({ evt: evt, name: path.dirname(fileName), path: fileName }); }
            }
          }));
        }
      });
    }
  }
  scanner = new MediaScanner();
});

ipcRenderer.on("mediascanner-scan-start", () => {
  scanner.info("starting scan");
  scanner.startScan();
});

ipcRenderer.on("mediascanner-scan-cancel", () => {
  scanner.info("cancel scan");
  scanner.cancelScan();
});

ipcRenderer.on("mediascanner-cleaup-start", () => {
  scanner.info("cancel scan");
  scanner.cleanup();
});

ipcRenderer.on("mediascanner-inc-cleaup-start", () => {
  scanner.info("cancel scan");
  scanner.incrementalCleanup();
});

ipcRenderer.on("mediascanner-watcher-configure", () => {
  scanner.info("Reconfigure File Watcher");
  scanner.configFileWatcher();
});