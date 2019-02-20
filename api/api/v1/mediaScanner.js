'use strict';
const fs = require("fs");
const path = require('path');
const utils = require('./utils');
const parser = require('xml2json');
const klawSync = require('klaw-sync');
const structures = require('./structures');
const mm = require('../../music-metadata');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var logger = require('../../../common/logger');

var db = null;

var scanStatus = {
  status: '',
  isScanning: false,
  shouldCancel: false
};


function MediaScanner(database) {
  db = database;
  resetStatus();
};

function downloadPage(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, false); // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    return JSON.parse(request.responseText);
  } else return null;
}

function updateStatus(status, isScanning) {
  scanStatus.status = status;
  scanStatus.isScanning = isScanning;
  logger.info("alloydb", JSON.stringify(scanStatus));
};

function isScanning() {
  return scanStatus.isScanning;
};

function shouldCancel() {
  if (scanStatus.shouldCancel) {
    updateStatus("Scanning Cacelled", false);
    return true;
  }
  return false;
};

function resetStatus() {
  scanStatus = {
    status: '',
    isScanning: false,
    shouldCancel: false
  };
};

function writeDb(data, table) {
  var sql = 'INSERT OR REPLACE INTO ' + table + ' (';
  var values = {};
  Object.keys(data).forEach(function (key, index) {
    if (index == Object.keys(data).length - 1)
      sql += key;
    else
      sql += key + ', ';
  });



  sql += ') VALUES (';


  Object.keys(data).forEach(function (key, index) {
    if (index == Object.keys(data).length - 1)
      sql += '@' + key;
    else
      sql += '@' + key + ', ';
  });

  sql += ')';

  try {
    var insert = db.prepare(sql);


    Object.keys(data).forEach(function (key, index) {
      var a = {};
      a[key] = data[key];
      Object.assign(values, a);
    });

    insert.run(values);
  } catch (err) {
    if (err) logger.error("alloydb", JSON.stringify(err));
    logger.info("alloydb", sql);
    logger.info("alloydb", values);
  }

};

function checkDBLinks(artist) {
  if (artist.Links) {
    artist.Links.forEach(function (link) {
      var existingLink = db.prepare('SELECT * FROM Links WHERE type=? AND target=? AND artist_id=?').all(link.type, link.target, artist.Id);
      if (existingLink.length === 0) {
        link.artist_id = artist.Id;
        writeDb(link, "Links")
      }
    });
  }
}

function checkDBArtistExists(artist) {
  var stmt = db.prepare('SELECT * FROM Artists WHERE id = ?');
  var existingArtist = stmt.all(artist.id);
  if (existingArtist.length === 0) {

    const artistTracks = klawSync(artist.path, {
      nodir: true
    });
    var validTracks = [];
    artistTracks.forEach(function (track) {
      if (utils.isFileValid(track.path)) {
        validTracks.push(track);
      }
    });
    artist.track_count = validTracks.length;

    writeDb(artist, "Artists");
    updateStatus("Inserted mapped artist " + artist.name, true);
  }

};

function checkExistingTrack(track, metadata) {
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

function checkAlbumArt(track, metadata) {
  if (metadata.common.picture) {

    var coverId = 'cvr_' + track.album_id;
    var coverFile = path.join(process.env.COVER_ART, coverId + '.jpg');

    var stmt = db.prepare('SELECT * FROM CoverArt WHERE id = ?');
    var existingCover = stmt.all(coverId);

    if (existingCover.length === 0) {
      var stmt = db.prepare('INSERT INTO CoverArt (id, album) VALUES (?, ?)');
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

function checkDBAlbumsExist(artist) {
  const albumDirs = klawSync(artist.path, {
    nofile: true
  });
  var mappedAlbums = [];
  albumDirs.forEach(function (dir) {
    if (fs.existsSync(path.join(dir.path, process.env.ALBUM_NFO))) {

      var json = JSON.parse(parser.toJson(fs.readFileSync(path.join(dir.path, process.env.ALBUM_NFO))));


      var albumUrl = process.env.BRAINZ_API_URL + "/api/v0.3/album/" + json.album.musicbrainzalbumid;

      const albumTracks = klawSync(dir.path, {
        nodir: true
      });
      var validTracks = [];
      albumTracks.forEach(function (track) {
        if (utils.isFileValid(track.path)) {
          validTracks.push(track);
        }
      });


      var albumInfo = downloadPage(albumUrl);
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

        var stmt = db.prepare('SELECT * FROM Albums WHERE id = ?');
        var existingAlbum = stmt.all(mappedAlbum.id);
        if (existingAlbum.length === 0) {
          writeDb(mappedAlbum, "Albums")
          updateStatus("Inserted mapped album " + mappedAlbum.name, true);
        }
        mappedAlbum.releases = [];
        albumInfo.Releases.forEach(function (release) {
          mappedAlbum.releases.push(release);
        })
        mappedAlbums.push(mappedAlbum);
      }

    }
  });
  return mappedAlbums;
}

function collectArtists() {
  return new Promise(function (resolve, reject) {
    var mediaPaths = db.prepare('SELECT * FROM MediaPaths').all();

    if (mediaPaths.length === 0) {
      updateStatus('No Media Path Defined ', false);
      return;
    }
    updateStatus('Collecting mapped and unmapped artist folders', true);

    var mappedArtistDirectories = [];

    mediaPaths.forEach(mediaPath => {
      if (shouldCancel()) reject("cancelled");

      const artistDirs = klawSync(mediaPath.path, {
        nofile: true,
        depthLimit: 0
      });

      artistDirs.forEach(function (dir) {
        if (fs.existsSync(path.join(dir.path, process.env.ARTIST_NFO))) {
          var mappedArtist = {
            path: dir.path
          };
          mappedArtistDirectories.push(mappedArtist);
        }
      });
    });
    resolve(mappedArtistDirectories);
  });
}

function scanArtists(artists) {
  const artist = artists.shift();

  if (artist) {
    updateStatus('Scanning artist ' + artist.path, true);
    var data = fs.readFileSync(path.join(artist.path, process.env.ARTIST_NFO));
    var json = JSON.parse(parser.toJson(data));
    var artistUrl = process.env.BRAINZ_API_URL + "/api/v0.3/artist/" + json.artist.musicbrainzartistid;
    var artistInfo = downloadPage(artistUrl);
    checkDBLinks(artistInfo);
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
    checkDBArtistExists(artist);
    var albums = checkDBAlbumsExist(artist);
    var allMetaPromises = [];
    albums.forEach(function (album) {
      const albumTracks = klawSync(album.path, {
        nodir: true
      });


      albumTracks.forEach(function (track) {
        if (utils.isFileValid(track.path)) {
          allMetaPromises.push(mm.parseFile(track.path).then(function (metadata) {
            var processed_track = new structures.Song();
            processed_track.path = track.path;
            processed_track.artist = utils.isStringValid(artist.name, '');
            processed_track.artist_id = artist.id;
            processed_track.album = utils.isStringValid(album.name, '');

            processed_track.album_path = album.path;
            processed_track.getStats();
            processed_track = checkExistingTrack(processed_track, metadata);
            processed_track.album_id = album.id;

            album.releases.forEach(function (release) {
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

            processed_track = checkAlbumArt(processed_track, metadata);

            writeDb(processed_track, "Tracks");
            updateStatus('Scanning track ' + track.path, true);
          }));
        }
      });
    });

    Promise.all(allMetaPromises).then(function () {
      updateStatus('finished scanning albums from ' + artist.name, true);
      return scanArtists(artists);
    })

  } else {
    db.checkpoint();
    updateStatus('Scan Complete', false);
  }
}

function fullScan() {
  collectArtists().then(function (mappedArtists) {
    updateStatus('found mapped artists ' + mappedArtists.length, true);
    scanArtists(mappedArtists);
  });
};

function cancel() {
  if (isScanning()) {
    scanStatus.shouldCancel = true;
    updateStatus('Starting cancel', false);
  } else {
    updateStatus("Cancelled scanning", false);
  }
};

function cleanup() {

  logger.info("alloydb", 'incremental cleanup complete');
  updateStatus('Scan Complete', false);
};

MediaScanner.prototype.cancelScan = function cancelScan() {
  logger.info("alloydb", 'cancelScan');
  cancel();
};

MediaScanner.prototype.incrementalCleanup = function incrementalCleanup() {
  if (isScanning()) {
    logger.debug("alloydb", 'scan in progress');
  } else {
    logger.info("alloydb", 'incrementalCleanup');
    cleanup();
  }
};

MediaScanner.prototype.startFullScan = function startScan() {
  if (isScanning()) {
    updateStatus("Scan in progress", true);
  } else {
    updateStatus("Start full Scan", true);
    fullScan();
  }
};

MediaScanner.prototype.startQuickScan = function startQuickScan() {
  if (isScanning()) {
    logger.debug("alloydb", 'scan in progress');
  } else {
    logger.info("alloydb", 'startQuickScan');
    resetStatus();

  }
};

MediaScanner.prototype.getStatus = function getStatus() {
  return scanStatus;
};

module.exports = MediaScanner;