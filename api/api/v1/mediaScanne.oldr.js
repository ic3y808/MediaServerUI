'use strict';
var structures = require('./structures');
var path = require('path')
var supportedExtensions = [".mp3", ".wav", ".flac", ".ogg", ".aiff", ".aac"];
var mm = require('music-metadata');
var fs = require('fs');
var del = require('del');
var klawSync = require('klaw-sync');
var Promise = require('bluebird');
var mime = require('mime-types')
const uuidv3 = require('uuid/v3');
const uuid_base = '1b671a64-40d5-491e-99b0-da01ff1f3341';
const walk = require('walk')


var scanStatus = { status: '', isScanning: false, shouldCancel: false };
var queueProcessSize = 300;
var currentQueue = [];
module.exports.db = {};

var filteredFiles = [];

var isFileValid = function (file) {
  for (var j = 0; j < supportedExtensions.length; j++) {
    var ext = supportedExtensions[j];
    if (file.substr(file.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
      return true;
    }
  }
  return false;
};

var processMetadata = function (file) {
  return mm.parseFile(file, { native: false, skipCovers: false });
}

var updateStatus = function (status, isScanning) {
  scanStatus.status = status;
  scanStatus.isScanning = isScanning;
}

var resetStatus = function () {
  scanStatus = { status: '', isScanning: false, shouldCancel: false };
}

var checkIsValidString = function (str, defaultStr) {
  if (str === undefined) {
    return defaultStr;
  } else if (typeof str === 'string') {
    if (str === null || str === undefined || str === '') return defaultStr;
    return str;
  } else if (Object.prototype.toString.call(str) === '[object Array]') {
    if (str.length === 0) return defaultStr;
    if (str[0] === null || str[0] === undefined || str[0] === '') return defaultStr;
    return str[0];
  }
  return str;
}

var checkMissingMedia = function () {
  var allMedia = module.exports.db.prepare('SELECT * FROM Tracks').all();
  allMedia.forEach(function (track) {
    if (!fs.existsSync(track.path)) {
      module.exports.db.prepare("DELETE FROM Tracks WHERE id=?").run(track.id);
    }
  });
}

var checkEmptyAlbums = function () {
  var allMedia = module.exports.db.prepare('SELECT * FROM Albums').all();
  allMedia.forEach(function (album) {
    var anyAlbums = module.exports.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    if (anyAlbums.length === 0) {
      module.exports.db.prepare("DELETE FROM Albums WHERE id=?").run(album.id);
    }
  });
}

var checkEmptyArtists = function () {
  var allMedia = module.exports.db.prepare('SELECT * FROM Artists').all();
  allMedia.forEach(function (artist) {
    var anyArtists = module.exports.db.prepare('SELECT * FROM Tracks WHERE artist_id=?').all(artist.id);
    if (anyArtists.length === 0) {
      module.exports.db.prepare("DELETE FROM Artists WHERE id=?").run(artist.id);
    }
  });
}

var checkEmptyGenres = function () {
  //console.time("checkEmptyGenres");
  var allMedia = module.exports.db.prepare('SELECT * FROM Genres').all();
  allMedia.forEach(function (genre) {
    var anyGenres = module.exports.db.prepare('SELECT * FROM Tracks WHERE genre_id=?').all(genre.id);
    if (anyGenres.length === 0) {
      module.exports.db.prepare("DELETE FROM Genres WHERE id=?").run(genre.id);
    }
  });
  //console.timeEnd("checkEmptyGenres");
}

var checkEmptyPlaylists = function () {
  //console.time("checkEmptyPlaylists");
  var allPlayslits = module.exports.db.prepare('SELECT * FROM Playlists').all();
  allPlayslits.forEach(function (playlist) {
    var anyTracks = module.exports.db.prepare('SELECT * FROM PlaylistTracks WHERE id=?').all(playlist.id);
    if (anyTracks.length === 0) {
      module.exports.db.prepare("DELETE FROM Playlists WHERE id=?").run(playlist.id);
    }
  });
  //console.timeEnd("checkEmptyPlaylists");
}

var allPlaylistTracks = function () {
  //console.time("allPlaylistTracks");
  module.exports.db.prepare('SELECT * FROM PlaylistTracks').all();
  allPlaylistTracks.forEach(function (playlistTrack) {
    var anyPlaylists = module.exports.db.prepare('SELECT * FROM Playlists WHERE id=?').all(playlistTrack.id);
    if (anyPlaylists.length === 0) {
      module.exports.db.prepare("DELETE FROM PlaylistTracks WHERE song_id=?").run(playlistTrack.song_id);
    }
  });
  //console.timeEnd("allPlaylistTracks");
}

var checkExtraAlbumArt = function () {
  //console.time("checkExtraAlbumArt");
  if (!fs.existsSync(process.env.COVER_ART)) {
    fs.mkdirSync(process.env.COVER_ART);
  }

  fs.readdir(process.env.COVER_ART, function (err, items) {
    items.forEach(function (file) {
      var anyArt = module.exports.db.prepare('SELECT * FROM CoverArt WHERE id=?').all(file.replace('.jpg', ''));
      if (anyArt.length === 0) del.sync(path.join(process.env.COVER_ART, file));
    });
  });

  var allCoverArt = module.exports.db.prepare('SELECT * FROM CoverArt').all();
  allCoverArt.forEach(function (art) {
    var anyArt = module.exports.db.prepare('SELECT * FROM Tracks WHERE cover_art=?').all(art.id);
    if (anyArt.length === 0) {
      module.exports.db.prepare("DELETE FROM CoverArt WHERE id=?").run(art.id);
      var coverId = 'cvr_' + art.album_id;
      var coverFile = path.join(process.env.COVER_ART, coverId + '.jpg');
      del.sync(coverFile);
    }
  });
  //console.timeEnd("checkExtraAlbumArt");
}

var checkExistingTrack = function (track, metadata) {
  //console.time("checkExistingTrack");
  var stmt = module.exports.db.prepare('SELECT * FROM Tracks WHERE path = ?');
  var existingTrack = stmt.all(track.path);

  track.artist = checkIsValidString(metadata.common.artist, "No Artist");
  track.title = checkIsValidString(metadata.common.title, "");
  track.album = checkIsValidString(metadata.common.album, "No Album");
  track.genre = checkIsValidString((metadata.common.genre !== undefined && metadata.common.genre[0] !== undefined && metadata.common.genre[0] !== '') ? metadata.common.genre[0] : "No Genre");
  track.bpm = checkIsValidString(metadata.common.bpm, "");
  track.rating = checkIsValidString((metadata.common.rating !== undefined && metadata.common.rating.rating !== undefined && metadata.common.rating.rating !== '') ? metadata.common.rating.rating : "");
  track.year = metadata.common.year;
  track.suffix = checkIsValidString(metadata.common.suffix, "");;
  track.no = metadata.common.track.no;
  track.of = metadata.common.track.of;
  track.musicbrainz_trackid = checkIsValidString(metadata.common.musicbrainz_trackid, null);
  track.musicbrainz_albumid = checkIsValidString(metadata.common.musicbrainz_albumid, null);
  track.musicbrainz_artistid = checkIsValidString(metadata.common.musicbrainz_artistid, null);
  track.musicbrainz_albumartistid = checkIsValidString(metadata.common.musicbrainz_albumartistid, null);
  track.musicbrainz_releasegroupid = checkIsValidString(metadata.common.musicbrainz_releasegroupid, null);
  track.musicbrainz_workid = checkIsValidString(metadata.common.musicbrainz_workid, null);
  track.musicbrainz_trmid = checkIsValidString(metadata.common.musicbrainz_trmid, null);
  track.musicbrainz_discid = checkIsValidString(metadata.common.musicbrainz_discid, null);
  track.acoustid_id = checkIsValidString(metadata.common.acoustid_id, null);
  track.acoustid_fingerprint = checkIsValidString(metadata.common.acoustid_fingerprint, null);
  track.musicip_puid = checkIsValidString(metadata.common.musicip_puid, null);
  track.musicip_fingerprint = checkIsValidString(metadata.common.musicip_fingerprint, null);

  if (existingTrack.length === 0) {
    track.id = uuidv3(track.path, uuid_base).split('-')[0];
  } else {
    track.id = existingTrack[0].id;
  }
  //console.timeEnd("checkExistingTrack");
  return track;
}

var getBaseInformation = function (track) {
  //console.time("getBaseInformation");
  var mediaPaths = module.exports.db.prepare('SELECT * FROM MediaPaths').all();

  track.base_path = path.normalize(track.path);
  mediaPaths.forEach(mediaPath => {
    mediaPath.path = path.normalize(mediaPath.path);
    track.base_path = track.base_path.replace(mediaPath.path, '');
  });
  track.base_path = track.base_path.substring(1, track.base_path.length)
  track.base_path = track.base_path.split(path.sep);
  track.base_path = track.base_path[0];

  var stmt = module.exports.db.prepare('SELECT * FROM BasePaths WHERE base_path = ?');
  var existingBasePath = stmt.all(track.base_path);
  if (existingBasePath.length === 0) {
    track.base_id = 'base_' + uuidv3(track.path, uuid_base).split('-')[0];
    var stmt = module.exports.db.prepare('INSERT INTO BasePaths (base_id, base_path) VALUES (?,?)');
    var info = stmt.run(track.base_id, track.base_path);
  } else {
    track.base_id = existingBasePath[0].base_id;
  }
  //console.timeEnd("getBaseInformation");
  return track;
}

var getArtistInformation = function (track) {
  //console.time("getArtistInformation");
  var tempArtistId = 'artist_' + uuidv3(track.path, uuid_base).split('-')[0];
  var stmt = module.exports.db.prepare('SELECT * FROM Artists WHERE id = ? OR name = ? OR musicbrainz_artistid = ? OR musicbrainz_albumartistid = ?');
  var existingArtist = stmt.all(tempArtistId, track.artist, track.musicbrainz_artistid, track.musicbrainz_albumartistid);
  if (existingArtist.length === 0) {
    track.artist_id = tempArtistId;
    var stmt = module.exports.db.prepare('INSERT INTO Artists (id, name, base_path, base_id, musicbrainz_artistid, musicbrainz_albumartistid) VALUES (?, ?, ?, ?, ?, ?)');
    var info = stmt.run(track.artist_id, track.artist, track.base_path, track.base_id, track.musicbrainz_artistid, track.musicbrainz_albumartistid);
  } else {
    track.artist_id = existingArtist[0].id;
    track.musicbrainz_artistid = existingArtist[0].musicbrainz_artistid;
    track.musicbrainz_albumartistid = existingArtist[0].musicbrainz_albumartistid;
  }
  //console.timeEnd("getArtistInformation");
  return track;
}

var getGenreInformation = function (track) {
  //console.time("getGenreInformation");
  try {

    var genre = track.genre.split('/');
    if (genre.length > 0) {
      track.genre = genre[0];
    }

    var tempGenreId = 'genre_' + uuidv3(track.genre, uuid_base).split('-')[0];
    var stmt = module.exports.db.prepare('SELECT * FROM Genres WHERE id = ? OR name = ?');
    var existingGenre = stmt.all(tempGenreId, track.genre);
    if (existingGenre.length === 0) {
      track.genre_id = tempGenreId;
      var stmt = module.exports.db.prepare('INSERT INTO Genres (id, name) VALUES (?,?)');
      var info = stmt.run(track.genre_id, track.genre);
    } else {
      track.genre_id = existingGenre[0].id;
    }
  } catch (err) {
    console.log(err);
  }
  //console.timeEnd("getGenreInformation");
  return track;
}

var getAlbumInformation = function (track) {
  //console.time("getAlbumInformation");
  track.album_path = path.dirname(track.path);

  var tempAlbumId = 'album_' + uuidv3(track.album_path, uuid_base).split('-')[0];
  var stmt = module.exports.db.prepare('SELECT * FROM Albums WHERE id = ?');
  var existingAlbum = stmt.all(tempAlbumId);
  if (existingAlbum.length === 0) {
    track.album_id = tempAlbumId;
    var stmt = module.exports.db.prepare('INSERT INTO Albums (id, name, base_path, base_id, path, artist, artist_id, genre, genre_id) VALUES (?,?,?,?,?,?,?,?,?)');
    var info = stmt.run(track.album_id, track.album, track.base_path, track.base_id, track.album_path, track.artist, track.artist_id, track.genre, track.genre_id);
  } else {
    track.album_id = existingAlbum[0].id;
  }
  //console.timeEnd("getAlbumInformation");
  return track;
}

var getMediaInfo = function (track, metadata) {
  //console.time("getMediaInfo");
  if (metadata.common.picture) {

    var coverId = 'cvr_' + track.album_id;
    var coverFile = path.join(process.env.COVER_ART, coverId + '.jpg');

    var stmt = module.exports.db.prepare('SELECT * FROM CoverArt WHERE id = ?');
    var existingCover = stmt.all(coverId);

    if (existingCover.length === 0) {
      var stmt = module.exports.db.prepare('INSERT INTO CoverArt (id, album) VALUES (?, ?)');
      var info = stmt.run(coverId, track.album);
    }

    track.cover_art = coverId;

    if (!fs.existsSync(coverFile)) {
      fs.writeFile(coverFile, metadata.common.picture[0].data, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  }
  //console.timeEnd("getMediaInfo");
  return track;
}

var writeQueue = function (force) {
  if (currentQueue.length >= queueProcessSize || (force === true && currentQueue.length > 0)) {


    //console.time("writeQueue");
    var insertMany = module.exports.db.transaction((tracks) => {
      for (var track of tracks) {

        var sql = 'INSERT OR REPLACE INTO Tracks (';

        Object.keys(track).forEach(function (key, index) {
          if (index == Object.keys(track).length - 1)
            sql += key;
          else
            sql += key + ', ';
        });



        sql += ') VALUES (';


        Object.keys(track).forEach(function (key, index) {
          if (index == Object.keys(track).length - 1)
            sql += '@' + key;
          else
            sql += '@' + key + ', ';
        });

        sql += ')';


        try {
          var insert = module.exports.db.prepare(sql);

          var t = {};
          Object.keys(track).forEach(function (key, index) {
            var a = {};
            a[key] = track[key];
            Object.assign(t, a);
          });

          insert.run(t);
        } catch (err) {
          //if (!module.exports.db.inTransaction) throw err; // (transaction was forcefully rolled back)
          console.log(err);
          console.log(sql);

        }

      }
      currentQueue = [];
      //console.timeEnd("writeQueue");
      console.log('writing writing database');
      //updateStatus('writing database', !force);
    });
    insertMany(currentQueue);
  }
};

var processTrack = function (prev, track, index) {
  return prev.then(function () {
    if (scanStatus.shouldCancel) {
      writeQueue(true);
      return new Promise(function (resolve, reject) { resolve(); });
    }
    //console.time("processTrack " + track.path);
    return processMetadata(track.path).then(function (metadata) {


    });
  });
}

var rescanAllMedia = async function (resolve, reject) {
  var mediaPaths = module.exports.db.prepare('SELECT * FROM MediaPaths').all();

  filteredFiles = [];

  mediaPaths.forEach(mediaPath => {
    if (!scanStatus.shouldCancel) {
      const files = klawSync(mediaPath.path, { nodir: true })
      files.forEach(function (file) {
        if (!scanStatus.shouldCancel && isFileValid(file.path)) {
          filteredFiles.push(file.path);
        }
      });
    }
  });

  //function compare(a,b) {
  //  if (a.size < b.size)
  //    return -1;
  //  if (a.size > b.size)
  //    return 1;
  //  return 0;
  //}
  //
  //filteredFiles.sort(compare);

  updateStatus('Scanning 0 / ' + filteredFiles.length, true);

  new Promise(function (resolve, reject) {
    mediaPaths.forEach(mediaPath => {
      const walker = walk.walk(mediaPath.path);

      var filesParsed = 0;

      walker.on("file", function (root, fileStats, next) {

        switch (path.extname(fileStats.name)) {
          case ".mp3":
          case ".m4a":
          case ".wav":
          case ".ogg":
          case ".flac":
            // Queue (asynchronous call) parsing of metadata
            var fn = path.join(root, fileStats.name);
            mm.parseFile(fn).then(function (metadata) {


              var track = new structures.Song();
              track.path = fn;
              var stats = fs.statSync(track.path);
              track.content_type = mime.lookup(track.path);
              track.size = stats.size;
              track.last_modified = stats.mtime.getTime();

              var status = "Scanning " + filesParsed.toString() + " / " + (filteredFiles.length - 1).toString();
              //console.log("Scanning " + track.path + " - " + track.size);
              updateStatus(status, true);
              track = checkExistingTrack(track, metadata);
              track = getBaseInformation(track);
              track = getArtistInformation(track);
              track = getGenreInformation(track);
              track = getAlbumInformation(track);
              track = getMediaInfo(track, metadata);

              currentQueue.push(track);
              ++filesParsed;
              //console.timeEnd("processTrack " + track.path);
              if (filesParsed === filteredFiles.length - 1) {
                writeQueue(true);
                checkEmptyAlbums();
                checkEmptyArtists();
                checkEmptyGenres();
                checkEmptyPlaylists();
                checkExtraAlbumArt();
                updateStatus("Scanning Complete", false);
                setTimeout(function () {
                  resetStatus();
                }, 5000)
              }
              else
                writeQueue(false);

              next(); // asynchronous call completed, 'release' next
            }).catch(function (err) {
              console.error('Error parsing:  %s', fn);
              console.error(err.message);
              next();
            });
            break;

          default:
            next(); // Go to next file, no asynchronous call 'queued'
        }
      });
    });
  });

  //  filteredFiles.reduce(processTrack, Promise.resolve());

  resolve("Files scan started. Total: " + filteredFiles.length);
}

module.exports.startScan = function () {
  return new Promise(function (resolve, reject) {

    if (scanStatus && scanStatus.isScanning) resolve("Scan already in progress, use cancel_scan first");

    try {
      updateStatus('Starting Scan', true);
      checkMissingMedia();
      rescanAllMedia(resolve, reject);

    }
    catch (err) {
      updateStatus('Failed Scan - ' + err.stack, false);
      resolve('Failed Scan - ' + err.stack);
    }
  });
}

module.exports.getStatus = function () {
  return scanStatus;
};

module.exports.cancelScan = function () {
  scanStatus.shouldCancel = true;
  setTimeout(() => {
    resetStatus();
  }, 3000);
  return "Started cancel process";
};

module.exports.incrementalCleanup = function () {
  checkEmptyAlbums();
  checkEmptyArtists();
  checkEmptyGenres();
  checkEmptyPlaylists();
  checkExtraAlbumArt();
};