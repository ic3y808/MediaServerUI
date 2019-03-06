'use strict';
const fs = require("fs");
const path = require('path');
const utils = require('./utils');
const parser = require('xml2json');
const klawSync = require('klaw-sync');
const structures = require('./structures');
const mm = require('../../music-metadata');
const MediaScannerBase = require('./MediaScannerBase');

var logger = require('../../../common/logger');

class MediaScanner extends MediaScannerBase {

  constructor(database) {
    super(database);
  }

  startQuickScan() {
    if (this.isScanning()) {
      this.updateStatus("Scan in progress", true);
      logger.debug("alloydb", 'scan in progress');
    } else {
      logger.info("alloydb", 'start Quick Scan');
      this.resetStatus();

    }
  }

  startFullScan() {
    if (this.isScanning()) {
      this.updateStatus("Scan in progress", true);
      logger.debug("alloydb", 'scan in progress');
    } else {
      logger.debug("alloydb", 'start Full Scan');
      var collectedArtistFolders = this.collectArtists();

      this.updateStatus('found mapped artists ' + collectedArtistFolders.mappedArtists.length, true);
      this.updateStatus('found unmapped artists ' + collectedArtistFolders.unmappedArtists.length, true);
      this.scanArtists(collectedArtistFolders.mappedArtists);
    }
  }

  checkDBLinks(artist) {
    if (artist.Links) {
      artist.Links.forEach(link => {
        var existingLink = this.db.prepare('SELECT * FROM Links WHERE type=? AND target=? AND artist_id=?').all(link.type, link.target, artist.Id);
        if (existingLink.length === 0) {
          link.artist_id = artist.Id;
          this.writeDb(link, "Links")
        }
      });
    }
  }

  checkDBArtistExists(artist) {
    var stmt = this.db.prepare('SELECT * FROM Artists WHERE id = ?');
    var existingArtist = stmt.all(artist.id);
    if (existingArtist.length === 0) {

      const artistTracks = klawSync(artist.path, { nodir: true });
      var validTracks = [];
      artistTracks.forEach(track => {
        if (utils.isFileValid(track.path)) {
          validTracks.push(track);
        }
      });
      artist.track_count = validTracks.length;

      this.writeDb(artist, "Artists");
      this.updateStatus("Inserted mapped artist " + artist.name, true);
    }
  };

  checkDBAlbumsExist(artist) {
    const albumDirs = klawSync(artist.path, {
      nofile: true
    });
    var mappedAlbums = [];
    albumDirs.forEach(dir => {
      if (fs.existsSync(path.join(dir.path, process.env.ALBUM_NFO))) {
        var json = JSON.parse(parser.toJson(fs.readFileSync(path.join(dir.path, process.env.ALBUM_NFO))));
        var albumUrl = process.env.BRAINZ_API_URL + "/api/v0.3/album/" + json.album.musicbrainzalbumid;

        const albumTracks = klawSync(dir.path, {
          nodir: true
        });
        var validTracks = [];
        albumTracks.forEach(track => {
          if (utils.isFileValid(track.path)) {
            validTracks.push(track);
          }
        });


        var albumInfo = this.downloadPage(albumUrl);
        if (albumInfo) {
          var mappedAlbum = {
            id: json.album.musicbrainzalbumid,
            artist: utils.isStringValid(artist.name, ''),
            artist_id: artist.id,
            name: utils.isStringValid(albumInfo.Title, ''),
            path: dir.path,
            created: json.album.releasedate,
            type: utils.isStringValid(albumInfo.Type, ''),
            rating: albumInfo.Rating.Count,
            track_count: validTracks.length
            //has_coverart: fs.existsSync(path.join(dir.path, process.env.COVERART_IMAGE)),
          };

          var stmt = this.db.prepare('SELECT * FROM Albums WHERE id = ?');
          var existingAlbum = stmt.all(mappedAlbum.id);
          if (existingAlbum.length === 0) {
            this.writeDb(mappedAlbum, "Albums")
            this.updateStatus("Inserted mapped album " + mappedAlbum.name, true);
          }
          mappedAlbum.releases = [];
          albumInfo.Releases.forEach(release => {
            mappedAlbum.releases.push(release);
          })
          mappedAlbums.push(mappedAlbum);
        }

      }
    });
    return mappedAlbums;
  }

  checkExistingTrack(track, metadata) {
    track.id = utils.isStringValid(metadata.common.musicbrainz_recordingid, "");
    track.artist = utils.isStringValid(metadata.common.artist, "No Artist");
    track.title = utils.isStringValid(metadata.common.title, "");
    track.album = utils.isStringValid(metadata.common.album, "No Album");
    track.genre = utils.isStringValid((metadata.common.genre !== undefined && metadata.common.genre[0] !== undefined && metadata.common.genre[0] !== '') ? metadata.common.genre[0] : "No Genre");
    track.bpm = utils.isStringValid(metadata.common.bpm, "");
    track.year = metadata.common.year;
    track.suffix = utils.isStringValid(metadata.common.suffix, "");;
    track.no = metadata.common.track.no;
    track.of = metadata.common.track.of;
    return track;
  }

  checkAlbumArt(track, metadata) {
    if (metadata.common.picture) {

      var coverId = 'cvr_' + track.album_id;
      var coverFile = path.join(process.env.COVER_ART_DIR, coverId + '.jpg');

      var stmt = this.db.prepare('SELECT * FROM CoverArt WHERE id = ?');
      var existingCover = stmt.all(coverId);

      if (existingCover.length === 0) {
        var stmt = this.db.prepare('INSERT INTO CoverArt (id, album) VALUES (?, ?)');
        var info = stmt.run(coverId, track.album);
      }

      track.cover_art = coverId;

      if (!fs.existsSync(coverFile)) {
        fs.writeFile(coverFile, metadata.common.picture[0].data, function (err) {
          if (err) {
            logger.error("alloydb", JSON.stringify(err));
          }
        });
      }
    }
    return track;
  }

  collectArtists() {
    var mediaPaths = this.db.prepare('SELECT * FROM MediaPaths').all();

    if (mediaPaths.length === 0) {
      this.updateStatus('No Media Path Defined ', false);
      return;
    }
    this.updateStatus('Collecting mapped and unmapped artist folders', true);

    var mappedArtistDirectories = [];
    var unmappedArtistDirectories = [];

    mediaPaths.forEach(mediaPath => {
      if (this.shouldCancel()) return {
        mappedArtists: mappedArtistDirectories,
        unmappedArtists: unmappedArtistDirectories
      };

      const artistDirs = klawSync(mediaPath.path, {
        nofile: true,
        depthLimit: 0
      });

      artistDirs.forEach(dir => {
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

      this.updateStatus('Scanning artist ' + artist.path, true);
      var data = fs.readFileSync(path.join(artist.path, process.env.ARTIST_NFO));
      var json = JSON.parse(parser.toJson(data));
      var artistUrl = process.env.BRAINZ_API_URL + "/api/v0.3/artist/" + json.artist.musicbrainzartistid;
      var artistInfo = this.downloadPage(artistUrl);
      this.checkDBLinks(artistInfo);
      var mappedArtist = {
        id: json.artist.musicbrainzartistid,
        name: utils.isStringValid(json.artist.title, ''),
        sort_name: utils.isStringValid(artistInfo.SortName, ''),
        biography: utils.isStringValid(json.artist.biography, ''),
        status: utils.isStringValid(artistInfo.Status, ''),
        rating: artistInfo.Rating.Count,
        type: utils.isStringValid(artistInfo.Type, ''),
        disambiguation: utils.isStringValid(artistInfo.Disambiguation, ''),
        overview: utils.isStringValid(artistInfo.Overview, ''),
        //has_fanart: fs.existsSync(path.join(dir.path, process.env.FANART_IMAGE)),
        //has_folderart: fs.existsSync(path.join(dir.path, process.env.FOLDER_IMAGE)),
        //has_logoart: fs.existsSync(path.join(dir.path, process.env.LOGO_IMAGE))
      };

      Object.assign(artist, mappedArtist);
      this.checkDBArtistExists(artist);
      var albums = this.checkDBAlbumsExist(artist);
      var allMetaPromises = [];
      albums.forEach(album => {

        try {
          const albumTracks = klawSync(album.path, {
            nodir: true
          });


          albumTracks.forEach(track => {
            if (utils.isFileValid(track.path)) {
              allMetaPromises.push(mm.parseFile(track.path).then(metadata => {
                var processed_track = new structures.Song();
                processed_track.path = track.path;
                processed_track.artist = utils.isStringValid(artist.name, '');
                processed_track.artist_id = artist.id;
                processed_track.album = utils.isStringValid(album.name, '');

                processed_track.album_path = album.path;
                processed_track.getStats();
                processed_track = this.checkExistingTrack(processed_track, metadata);
                processed_track.album_id = album.id;

                album.releases.forEach(release => {
                  release.Tracks.forEach(albumTrack => {
                    if (!processed_track.id) {
                      var msCompare = processed_track.duration == parseInt(albumTrack.DurationMs / 1000);
                      var tracknumCompare = processed_track.no == albumTrack.TrackPosition;
                      var mediumCompare = processed_track.of == release.TrackCount;

                      if (msCompare && tracknumCompare && mediumCompare) {
                        processed_track.id = albumTrack.RecordingId;
                        processed_track.title = albumTrack.TrackName;
                      }
                    } else {
                      if (processed_track.id === albumTrack.RecordingId) {
                        processed_track.title = albumTrack.TrackName;
                      }
                    }
                  });
                });

                processed_track = this.checkAlbumArt(processed_track, metadata);

                this.writeDb(processed_track, "Tracks");
                this.updateStatus('Scanning track ' + track.path, true);
              }));
            }
          });
        } catch (err) { console.log(err); }
      });

      Promise.all(allMetaPromises).then(() => {
        this.updateStatus('finished scanning albums from ' + artist.name, true);
        resolve();
      })
    });
  }

  scanArtists(artists) {
    const artist = artists.shift();

    if (artist) {

      this.scanArtist(artist).then(() => {
        this.scanArtists(artists);
      })

    } else {
      this.db.checkpoint();
      this.updateStatus('Scan Complete', false);
    }
  }

  scanPath(dir) {
    if (this.isScanning()) {
      this.updateStatus("Scan in progress", true);
      logger.debug("alloydb", 'scan in progress');
    } else {
      if (fs.lstatSync(dir).isDirectory()) {
        if (fs.existsSync(path.join(dir, process.env.ARTIST_NFO))) {
          this.scanArtist({ path: dir }).then(() => {
            this.db.checkpoint();
            this.updateStatus('Scan Complete', false);
          })
        }
      } else {
        var root = path.dirname(dir)

        const artistDirs = klawSync(root, {
          nofile: true,
          depthLimit: 0
        });

        if (artistDirs.length > 0) {
          artistDirs.forEach(dir => {
            if (fs.existsSync(path.join(dir, process.env.ARTIST_NFO))) {
              this.scanArtist({ path: dir }).then(() => {
                this.db.checkpoint();
                this.updateStatus('Scan Complete', false);
              })
            }
          });
        } else if (fs.existsSync(path.join(root, process.env.ALBUM_NFO))) {
          this.scanArtist({ path: path.dirname(root) }).then(() => {
            this.db.checkpoint();
            this.updateStatus('Scan Complete', false);
          })
        }
      }
    }
  }
}

module.exports = MediaScanner;