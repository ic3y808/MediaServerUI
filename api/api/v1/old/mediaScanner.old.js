'use strict';
const fs = require("fs");
const del = require('del');
const structures = require('./structures');
const mm = require('../../music-metadata');
const klawSync = require('klaw-sync');
const uuidv3 = require('uuid/v3');
const path = require('path')
const mime = require('mime-types')
const supportedExtensions = [".mp3", ".wav", ".flac", ".ogg", ".aiff", ".aac"];
const uuid_base = '1b671a64-40d5-491e-99b0-da01ff1f3341';

function MediaScanner(db) {
  this.db = db;
  this.filteredFiles = [];
  this.currentQueue = [];
  this.queueProcessSize = 300;
  this.maxFilesProcessing = 25;
  this.resetStatus();
}

MediaScanner.prototype.processMetadata = function processMetadata(file) {
  return mm.parseFile(file, { native: false, skipCovers: false });
}

MediaScanner.prototype.isFileValid = function isFileValid(file) {
  for (var j = 0; j < supportedExtensions.length; j++) {
    var ext = supportedExtensions[j];
    if (file.substr(file.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
      return true;
    }
  }
  return false;
};

MediaScanner.prototype.checkIsValidString = function checkIsValidString(str, defaultStr) {
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

MediaScanner.prototype.checkMissingMedia = function checkMissingMedia() {
  var that = this;
  var allMedia = that.db.prepare('SELECT * FROM Tracks').all();
  allMedia.forEach(function (track) {
    if (!fs.existsSync(track.path)) {
      that.db.prepare("DELETE FROM Tracks WHERE id=?").run(track.id);
    }
  });
}

MediaScanner.prototype.checkEmptyAlbums = function checkEmptyAlbums() {
  var that = this;
  var allMedia = this.db.prepare('SELECT * FROM Albums').all();
  allMedia.forEach(function (album) {
    var anyAlbums = that.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    if (anyAlbums.length === 0) {
      that.db.prepare("DELETE FROM Albums WHERE id=?").run(album.id);
    }
  });
}

MediaScanner.prototype.checkEmptyArtists = function checkEmptyArtists() {
  var that = this;
  var allMedia = that.db.prepare('SELECT * FROM Artists').all();
  allMedia.forEach(function (artist) {
    var anyArtists = that.db.prepare('SELECT * FROM Tracks WHERE artist_id=?').all(artist.id);
    if (anyArtists.length === 0) {
      that.db.prepare("DELETE FROM Artists WHERE id=?").run(artist.id);
    }
  });
}

MediaScanner.prototype.checkEmptyGenres = function checkEmptyGenres() {
  var that = this;
  var allMedia = that.db.prepare('SELECT * FROM Genres').all();
  allMedia.forEach(function (genre) {
    var anyGenres = that.db.prepare('SELECT * FROM Tracks WHERE genre_id=?').all(genre.id);
    if (anyGenres.length === 0) {
      that.db.prepare("DELETE FROM Genres WHERE id=?").run(genre.id);
    }
  });
  //console.timeEnd("checkEmptyGenres");
}

MediaScanner.prototype.checkEmptyPlaylists = function checkEmptyPlaylists() {
  var that = this;
  var allPlayslits = that.db.prepare('SELECT * FROM Playlists').all();
  allPlayslits.forEach(function (playlist) {
    var anyTracks = that.db.prepare('SELECT * FROM PlaylistTracks WHERE id=?').all(playlist.id);
    if (anyTracks.length === 0) {
      that.db.prepare("DELETE FROM Playlists WHERE id=?").run(playlist.id);
    }
  });
  //console.timeEnd("checkEmptyPlaylists");
}

MediaScanner.prototype.allPlaylistTracks = function allPlaylistTracks() {
  var that = this;
  that.db.prepare('SELECT * FROM PlaylistTracks').all();
  allPlaylistTracks.forEach(function (playlistTrack) {
    var anyPlaylists = that.db.prepare('SELECT * FROM Playlists WHERE id=?').all(playlistTrack.id);
    if (anyPlaylists.length === 0) {
      that.db.prepare("DELETE FROM PlaylistTracks WHERE song_id=?").run(playlistTrack.song_id);
    }
  });
  //console.timeEnd("allPlaylistTracks");
}

MediaScanner.prototype.checkExtraAlbumArt = function checkExtraAlbumArt() {
  var that = this;
  if (!fs.existsSync(process.env.COVER_ART_DIR)) {
    fs.mkdirSync(process.env.COVER_ART_DIR);
  }

  fs.readdir(process.env.COVER_ART_DIR, function (err, items) {
    items.forEach(function (file) {
      var anyArt = that.db.prepare('SELECT * FROM CoverArt WHERE id=?').all(file.replace('.jpg', ''));
      if (anyArt.length === 0) del.sync(path.join(process.env.COVER_ART_DIR, file));
    });
  });

  var allCoverArt = that.db.prepare('SELECT * FROM CoverArt').all();
  allCoverArt.forEach(function (art) {
    var anyArt = that.db.prepare('SELECT * FROM Tracks WHERE cover_art=?').all(art.id);
    if (anyArt.length === 0) {
      that.db.prepare("DELETE FROM CoverArt WHERE id=?").run(art.id);
      var coverId = 'cvr_' + art.album_id;
      var coverFile = path.join(process.env.COVER_ART_DIR, coverId + '.jpg');
      del.sync(coverFile);
    }
  });
  //console.timeEnd("checkExtraAlbumArt");
}

MediaScanner.prototype.checkExistingTrack = function checkExistingTrack(track, metadata) {
  //console.time("checkExistingTrack");
  var stmt = this.db.prepare('SELECT * FROM Tracks WHERE path = ?');
  var existingTrack = stmt.all(track.path);
  var newTrack = {};
  Object.assign(newTrack, existingTrack[0]);
  newTrack.path = track.path;
  newTrack.content_type = track.content_type;
  newTrack.size = track.size;
  newTrack.last_modified = track.last_modified;
  newTrack.artist = this.checkIsValidString(metadata.common.artist, "No Artist");
  newTrack.title = this.checkIsValidString(metadata.common.title, "");
  newTrack.album = this.checkIsValidString(metadata.common.album, "No Album");
  newTrack.genre = this.checkIsValidString((metadata.common.genre !== undefined && metadata.common.genre[0] !== undefined && metadata.common.genre[0] !== '') ? metadata.common.genre[0] : "No Genre");
  newTrack.bpm = this.checkIsValidString(metadata.common.bpm, "");
  newTrack.rating = this.checkIsValidString((metadata.common.rating !== undefined && metadata.common.rating.rating !== undefined && metadata.common.rating.rating !== '') ? metadata.common.rating.rating : "");
  newTrack.year = metadata.common.year;
  newTrack.suffix = this.checkIsValidString(metadata.common.suffix, "");;
  newTrack.no = metadata.common.track.no;
  newTrack.of = metadata.common.track.of;
  newTrack.musicbrainz_trackid = this.checkIsValidString(metadata.common.musicbrainz_trackid, null);
  newTrack.musicbrainz_albumid = this.checkIsValidString(metadata.common.musicbrainz_albumid, null);
  newTrack.musicbrainz_artistid = this.checkIsValidString(metadata.common.musicbrainz_artistid, null);
  newTrack.musicbrainz_albumartistid = this.checkIsValidString(metadata.common.musicbrainz_albumartistid, null);
  newTrack.musicbrainz_releasegroupid = this.checkIsValidString(metadata.common.musicbrainz_releasegroupid, null);
  newTrack.musicbrainz_workid = this.checkIsValidString(metadata.common.musicbrainz_workid, null);
  newTrack.musicbrainz_trmid = this.checkIsValidString(metadata.common.musicbrainz_trmid, null);
  newTrack.musicbrainz_discid = this.checkIsValidString(metadata.common.musicbrainz_discid, null);
  newTrack.acoustid_id = this.checkIsValidString(metadata.common.acoustid_id, null);
  newTrack.acoustid_fingerprint = this.checkIsValidString(metadata.common.acoustid_fingerprint, null);
  newTrack.musicip_puid = this.checkIsValidString(metadata.common.musicip_puid, null);
  newTrack.musicip_fingerprint = this.checkIsValidString(metadata.common.musicip_fingerprint, null);

  if (existingTrack.length === 0) {
    newTrack.id = uuidv3(track.path, uuid_base).split('-')[0];
  } else {
    newTrack.id = existingTrack[0].id;
  }
  //console.timeEnd("checkExistingTrack");
  return newTrack;
}

MediaScanner.prototype.getBaseInformation = function getBaseInformation(track) {
  //console.time("getBaseInformation");
  var mediaPaths = this.db.prepare('SELECT * FROM MediaPaths').all();

  track.base_path = path.normalize(track.path);
  mediaPaths.forEach(mediaPath => {
    mediaPath.path = path.normalize(mediaPath.path);
    track.base_path = track.base_path.replace(mediaPath.path, '');
  });
  track.base_path = track.base_path.substring(1, track.base_path.length)
  track.base_path = track.base_path.split(path.sep);
  track.base_path = track.base_path[0];

  var stmt = this.db.prepare('SELECT * FROM BasePaths WHERE base_path = ?');
  var existingBasePath = stmt.all(track.base_path);
  if (existingBasePath.length === 0) {
    track.base_id = 'base_' + uuidv3(track.path, uuid_base).split('-')[0];
    var stmt = this.db.prepare('INSERT INTO BasePaths (base_id, base_path) VALUES (?,?)');
    var info = stmt.run(track.base_id, track.base_path);
  } else {
    track.base_id = existingBasePath[0].base_id;
  }
  //console.timeEnd("getBaseInformation");
  return track;
}

MediaScanner.prototype.getArtistInformation = function getArtistInformation(track) {
  //console.time("getArtistInformation");
  var tempArtistId = 'artist_' + uuidv3(track.path, uuid_base).split('-')[0];
  var stmt = this.db.prepare('SELECT * FROM Artists WHERE id = ? OR name = ? OR musicbrainz_artistid = ? OR musicbrainz_albumartistid = ?');
  var existingArtist = stmt.all(tempArtistId, track.artist, track.musicbrainz_artistid, track.musicbrainz_albumartistid);
  if (existingArtist.length === 0) {
    track.artist_id = tempArtistId;
    var stmt = this.db.prepare('INSERT INTO Artists (id, name, base_path, base_id, musicbrainz_artistid, musicbrainz_albumartistid) VALUES (?, ?, ?, ?, ?, ?)');
    var info = stmt.run(track.artist_id, track.artist, track.base_path, track.base_id, track.musicbrainz_artistid, track.musicbrainz_albumartistid);
  } else {
    track.artist_id = existingArtist[0].id;
    track.musicbrainz_artistid = existingArtist[0].musicbrainz_artistid;
    track.musicbrainz_albumartistid = existingArtist[0].musicbrainz_albumartistid;
  }
  //console.timeEnd("getArtistInformation");
  return track;
}

MediaScanner.prototype.getGenreInformation = function getGenreInformation(track) {
  //console.time("getGenreInformation");
  try {

    var genre = track.genre.split('/');
    if (genre.length > 0) {
      track.genre = genre[0];
    }

    var tempGenreId = 'genre_' + uuidv3(track.genre, uuid_base).split('-')[0];
    var stmt = this.db.prepare('SELECT * FROM Genres WHERE id = ? OR name = ?');
    var existingGenre = stmt.all(tempGenreId, track.genre);
    if (existingGenre.length === 0) {
      track.genre_id = tempGenreId;
      var stmt = this.db.prepare('INSERT INTO Genres (id, name) VALUES (?,?)');
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

MediaScanner.prototype.getAlbumInformation = function getAlbumInformation(track) {
  //console.time("getAlbumInformation");
  track.album_path = path.dirname(track.path);

  var tempAlbumId = 'album_' + uuidv3(track.album_path, uuid_base).split('-')[0];
  var stmt = this.db.prepare('SELECT * FROM Albums WHERE id = ?');
  var existingAlbum = stmt.all(tempAlbumId);
  if (existingAlbum.length === 0) {
    track.album_id = tempAlbumId;
    var stmt = this.db.prepare('INSERT INTO Albums (id, name, base_path, base_id, path, artist, artist_id, genre, genre_id) VALUES (?,?,?,?,?,?,?,?,?)');
    var info = stmt.run(track.album_id, track.album, track.base_path, track.base_id, track.album_path, track.artist, track.artist_id, track.genre, track.genre_id);
  } else {
    track.album_id = existingAlbum[0].id;
  }
  //console.timeEnd("getAlbumInformation");
  return track;
}

MediaScanner.prototype.getMediaInfo = function getMediaInfo(track, metadata) {
  //console.time("getMediaInfo");
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
          console.log(err);
        }
      });
    }
  }
  //console.timeEnd("getMediaInfo");
  return track;
}

MediaScanner.prototype.step = function step() {
  var that = this;
  if (that.scanStatus.shouldCancel) return;
  var track = that.filteredFiles.shift();
  try {
    that.processMetadata(track.path).then(function (metadata) {
      that.updateStatus("scanning", true);

      track = that.checkExistingTrack(track, metadata);
      track = that.getBaseInformation(track);
      track = that.getArtistInformation(track);
      track = that.getGenreInformation(track);
      track = that.getAlbumInformation(track);
      track = that.getMediaInfo(track, metadata);

      that.currentQueue.push(track);
      //console.timeEnd("processTrack " + track.path);
      if (that.scanStatus.currentlyScanned === that.totalFiles) {
        that.writeQueue(true);
        that.checkEmptyAlbums();
        that.checkEmptyArtists();
        that.checkEmptyGenres();
        that.checkEmptyPlaylists();
        that.checkExtraAlbumArt();
        that.updateStatus("Scanning Complete", false);
        setTimeout(function () {
          that.resetStatus();
        }, 5000)
      }
      else
        that.writeQueue(false);

      if (that.filteredFiles.length > 0) { that.step(); }
      else {
        that.updateStatus("Scanning Complete", false);
      }
    });
  } catch (err) {
    if (that.filteredFiles.length > 0) { that.step(); }
    else {
      that.updateStatus("Scanning Complete", false);
    }
  }
};

MediaScanner.prototype.writeQueue = function writeQueue(force) {
  if (this.currentQueue.length >= this.queueProcessSize || (force === true && this.currentQueue.length > 0)) {


    //console.time("writeQueue");
    var insertMany = this.db.transaction((tracks) => {
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
          var insert = this.db.prepare(sql);

          var t = {};
          Object.keys(track).forEach(function (key, index) {
            var a = {};
            a[key] = track[key];
            Object.assign(t, a);
          });

          insert.run(t);
        } catch (err) {
          //if (!this.db.inTransaction) throw err; // (transaction was forcefully rolled back)
          console.log(err);
          console.log(sql);

        }

      }
      this.currentQueue = [];
      //console.timeEnd("writeQueue");
      console.log('writing writing database');
      //updateStatus('writing database', !force);
    });
    insertMany(this.currentQueue);
  }
};

MediaScanner.prototype.compare = function compare(a, b) {
  if (a.size > b.size)
    return -1;
  if (a.size < b.size)
    return 1;
  return 0;
};

MediaScanner.prototype.rescanAllMedia = function rescanAllMedia(resolve, reject) {
  var that = this;
  var mediaPaths = this.db.prepare('SELECT * FROM MediaPaths').all();

  that.filteredFiles = [];
  that.currentQueue = [];

  mediaPaths.forEach(mediaPath => {
    if (!that.scanStatus.shouldCancel) {
      const files = klawSync(mediaPath.path, { nodir: true })
      files.forEach(function (file) {
        if (!that.scanStatus.shouldCancel && that.isFileValid(file.path)) {
          var track = new structures.Song();
          track.path = file.path;
          var stats = fs.statSync(track.path);
          track.content_type = mime.lookup(track.path);
          track.size = stats.size;
          track.last_modified = stats.mtime.getTime();
          that.filteredFiles.push(track);
        }
      });
    }
  });

  that.filteredFiles.sort(MediaScanner.prototype.compare);
  that.totalFiles = that.filteredFiles.length;

  if (that.totalFiles < that.maxFilesProcessing) {
    that.step();
  }
  else {
    for (var i = 0; i < that.maxFilesProcessing; i++) {
      that.step();
    }
  }
};

MediaScanner.prototype.rescanQuick = function rescanAllMedia(resolve, reject) {
  var that = this;
  var mediaPaths = this.db.prepare('SELECT * FROM MediaPaths').all();

  that.filteredFiles = [];
  that.currentQueue = [];

  mediaPaths.forEach(mediaPath => {
    if (!that.scanStatus.shouldCancel) {
      const files = klawSync(mediaPath.path, { nodir: true })
      files.forEach(function (file) {
        if (!that.scanStatus.shouldCancel && that.isFileValid(file.path)) {
          var anyTracks = that.db.prepare('SELECT * FROM Tracks WHERE path=?').all(file.path);
          if (anyTracks.length === 0) {
            var track = new structures.Song();
            track.path = file.path;
            var stats = fs.statSync(track.path);
            track.content_type = mime.lookup(track.path);
            track.size = stats.size;
            track.last_modified = stats.mtime.getTime();
            that.filteredFiles.push(track);
          }
        }
      });
    }
  });




  that.filteredFiles.sort(MediaScanner.prototype.compare);
  that.totalFiles = that.filteredFiles.length;

  if (that.totalFiles < that.maxFilesProcessing) {
    that.step();
  }
  else {
    for (var i = 0; i < that.maxFilesProcessing; i++) {
      that.step();
    }
  }
};

MediaScanner.prototype.updateStatus = function updateStatus(status, isScanning) {
  this.scanStatus.status = status;
  this.scanStatus.isScanning = isScanning;
  this.scanStatus.totalFiles = this.totalFiles;
  this.scanStatus.currentlyScanned = this.totalFiles - this.filteredFiles.length;
};

MediaScanner.prototype.resetStatus = function resetStatus() {
  this.scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };
};

MediaScanner.prototype.getStatus = function getStatus() {
  return this.scanStatus;
};

MediaScanner.prototype.cancelScan = function cancelScan() {
  this.scanStatus.shouldCancel = true;
  setTimeout(() => {
    this.resetStatus();
  }, 3000);
  return "Started cancel process";
};

MediaScanner.prototype.incrementalCleanup = function incrementalCleanup() {
  this.checkEmptyAlbums();
  this.checkEmptyArtists();
  this.checkEmptyGenres();
  this.checkEmptyPlaylists();
  this.checkExtraAlbumArt();
};

MediaScanner.prototype.checkMissingMedia = function checkMissingMedia() {
  var that = this;
  var allMedia = that.db.prepare('SELECT * FROM Tracks').all();
  allMedia.forEach(function (track) {
    if (!fs.existsSync(track.path)) {
      that.db.prepare("DELETE FROM Tracks WHERE id=?").run(track.id);
    }
  });
};

MediaScanner.prototype.startFullScan = function startScan() {
  var that = this;
  if (that.scanStatus && that.scanStatus.isScanning) {
    return "Scan already in progress, use cancel_scan first";
  }

  that.updateStatus('Starting Scan', true);

  that.checkMissingMedia();

  new Promise(function (resolve, reject) {
    that.rescanAllMedia(resolve, reject);
  });

  return "Scan started";
};

MediaScanner.prototype.startQuickScan = function startQuickScan() {
  var that = this;
  if (that.scanStatus && that.scanStatus.isScanning) {
    return "Scan already in progress, use cancel_scan first";
  }

  that.updateStatus('Starting Scan', true);

  that.checkMissingMedia();

  new Promise(function (resolve, reject) {
    that.rescanQuick(resolve, reject);
  });

  return "Scan started";
};

module.exports = MediaScanner;