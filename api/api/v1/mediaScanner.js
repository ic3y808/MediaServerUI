const fs = require("fs");
const del = require('del');
const path = require('path');
const utils = require('./utils');
const uuidv3 = require('uuid/v3');
const mime = require('mime-types');
const Queue = require('better-queue');
const klawSync = require('klaw-sync');
const ffmpeg = require('ffprobe-static');
const structures = require('./structures');
const mm = require('../../music-metadata');
const execSync = require('child_process').execSync;
const uuid_base = '1b671a64-40d5-491e-99b0-da01ff1f3341';

var db = null;
var totalFiles = 0;
var filteredFiles = [];
var scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };

var q = new Queue(processQueue)
q.on('drain', cleanup);

function MediaScanner(database) {
  db = database;
  this.filteredFiles = [];
  resetStatus();
};

function processMetadata(file) {
  return mm.parseFile(file, { native: false, skipCovers: false });
};

function checkExistingTrack(track, metadata) {
  var stmt = db.prepare('SELECT * FROM Tracks WHERE path = ?');
  var existingTrack = stmt.all(track.path);
  var newTrack = {};
  Object.assign(newTrack, existingTrack[0]);
  newTrack.path = track.path;
  newTrack.content_type = track.content_type;
  newTrack.size = track.size;
  newTrack.last_modified = track.last_modified;
  newTrack.created = utils.isStringValid(metadata.common.originaldate, "");
  newTrack.artist = utils.isStringValid(metadata.common.artist, "No Artist");
  newTrack.title = utils.isStringValid(metadata.common.title, "");
  newTrack.album = utils.isStringValid(metadata.common.album, "No Album");
  newTrack.genre = utils.isStringValid((metadata.common.genre !== undefined && metadata.common.genre[0] !== undefined && metadata.common.genre[0] !== '') ? metadata.common.genre[0] : "No Genre");
  newTrack.bpm = utils.isStringValid(metadata.common.bpm, "");
  newTrack.rating = utils.isStringValid((metadata.common.rating !== undefined && metadata.common.rating.rating !== undefined && metadata.common.rating.rating !== '') ? metadata.common.rating.rating : "");
  newTrack.year = metadata.common.year;
  newTrack.suffix = utils.isStringValid(metadata.common.suffix, "");;
  newTrack.no = metadata.common.track.no;
  newTrack.of = metadata.common.track.of;
  newTrack.musicbrainz_trackid = utils.isStringValid(metadata.common.musicbrainz_trackid, null);
  newTrack.musicbrainz_albumid = utils.isStringValid(metadata.common.musicbrainz_albumid, null);
  newTrack.musicbrainz_artistid = utils.isStringValid(metadata.common.musicbrainz_artistid, null);
  newTrack.musicbrainz_albumartistid = utils.isStringValid(metadata.common.musicbrainz_albumartistid, null);
  newTrack.musicbrainz_releasegroupid = utils.isStringValid(metadata.common.musicbrainz_releasegroupid, null);
  newTrack.musicbrainz_workid = utils.isStringValid(metadata.common.musicbrainz_workid, null);
  newTrack.musicbrainz_trmid = utils.isStringValid(metadata.common.musicbrainz_trmid, null);
  newTrack.musicbrainz_discid = utils.isStringValid(metadata.common.musicbrainz_discid, null);
  newTrack.acoustid_id = utils.isStringValid(metadata.common.acoustid_id, null);
  newTrack.acoustid_fingerprint = utils.isStringValid(metadata.common.acoustid_fingerprint, null);
  newTrack.musicip_puid = utils.isStringValid(metadata.common.musicip_puid, null);
  newTrack.musicip_fingerprint = utils.isStringValid(metadata.common.musicip_fingerprint, null);

  const params = ' -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1  "' + newTrack.path + '"';

  var duration_out;
  try {
    duration_out = execSync(ffmpeg.path + params);
  } catch (ex) {
    duration_out = ex.stdout;
  }

  newTrack.duration = duration_out.toString()

  if (existingTrack.length === 0) {
    newTrack.id = uuidv3(track.path, uuid_base).split('-')[0];
  } else {
    newTrack.id = existingTrack[0].id;
  }
  return newTrack;
};

function getBaseInformation(track) {
  var mediaPaths = db.prepare('SELECT * FROM MediaPaths').all();

  track.base_path = path.normalize(track.path);
  mediaPaths.forEach(mediaPath => {
    mediaPath.path = path.normalize(mediaPath.path);
    track.base_path = track.base_path.replace(mediaPath.path, '');
  });
  track.base_path = track.base_path.substring(1, track.base_path.length)
  track.base_path = track.base_path.split(path.sep);
  track.base_path = track.base_path[0];

  var stmt = db.prepare('SELECT * FROM BasePaths WHERE base_path = ?');
  var existingBasePath = stmt.all(track.base_path);
  if (existingBasePath.length === 0) {
    track.base_id = 'base_' + uuidv3(track.path, uuid_base).split('-')[0];
    var stmt = db.prepare('INSERT INTO BasePaths (base_id, base_path) VALUES (?,?)');
    var info = stmt.run(track.base_id, track.base_path);
  } else {
    track.base_id = existingBasePath[0].base_id;
  }
  return track;
};

function getArtistInformation(track) {
  var tempArtistId = 'artist_' + uuidv3(track.path, uuid_base).split('-')[0];
  var stmt = db.prepare('SELECT * FROM Artists WHERE id = ? OR name = ? OR musicbrainz_artistid = ? OR musicbrainz_albumartistid = ?');
  var existingArtist = stmt.all(tempArtistId, track.artist, track.musicbrainz_artistid, track.musicbrainz_albumartistid);

  if (existingArtist.length === 0) {
    track.artist_id = tempArtistId;
    var stmt = db.prepare('INSERT INTO Artists (id, name, base_path, base_id, musicbrainz_artistid, musicbrainz_albumartistid) VALUES (?, ?, ?, ?, ?, ?)');
    var info = stmt.run(track.artist_id, track.artist, track.base_path, track.base_id, track.musicbrainz_artistid, track.musicbrainz_albumartistid);
  } else {
    track.artist_id = existingArtist[0].id;
    track.musicbrainz_artistid = existingArtist[0].musicbrainz_artistid;
    track.musicbrainz_albumartistid = existingArtist[0].musicbrainz_albumartistid;
  }
  return track;
};

function getGenreInformation(track) {
  try {

    var genre = track.genre.split('/');
    if (genre.length > 0) {
      track.genre = genre[0];
    }

    var tempGenreId = 'genre_' + uuidv3(track.genre, uuid_base).split('-')[0];
    var stmt = db.prepare('SELECT * FROM Genres WHERE id = ? OR name = ?');
    var existingGenre = stmt.all(tempGenreId, track.genre);
    if (existingGenre.length === 0) {
      track.genre_id = tempGenreId;
      var stmt = db.prepare('INSERT INTO Genres (id, name) VALUES (?,?)');
      var info = stmt.run(track.genre_id, track.genre);
    } else {
      track.genre_id = existingGenre[0].id;
    }
  } catch (err) {
    console.log(err);
  }
  return track;
};

function getAlbumInformation(track) {
  track.album_path = path.dirname(track.path);

  var tempAlbumId = 'album_' + uuidv3(track.album_path, uuid_base).split('-')[0];
  var stmt = db.prepare('SELECT * FROM Albums WHERE id = ?');
  var existingAlbum = stmt.all(tempAlbumId);
  if (existingAlbum.length === 0) {
    track.album_id = tempAlbumId;
    var stmt = db.prepare('INSERT INTO Albums (id, name, base_path, base_id, path, created, artist, artist_id, genre, genre_id) VALUES (?,?,?,?,?,?,?,?,?,?)');
    var info = stmt.run(track.album_id, track.album, track.base_path, track.base_id, track.album_path, track.created, track.artist, track.artist_id, track.genre, track.genre_id);
  } else {
    track.album_id = existingAlbum[0].id;
  }
  return track;
};

function getMediaInfo(track, metadata) {
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
          console.log(err);
        }
      });
    }
  }
  return track;
};

function writeTrack(track) {
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



  var insert = db.prepare(sql);

  var t = {};
  Object.keys(track).forEach(function (key, index) {
    var a = {};
    a[key] = track[key];
    Object.assign(t, a);
  });

  insert.run(t);
};

function checkEmptyAlbums() {
  console.log('checking empty albums')
  var allMedia = db.prepare('SELECT * FROM Albums').all();
  allMedia.forEach(function (album) {
    var anyAlbums = db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    if (anyAlbums.length === 0) {
      db.prepare("DELETE FROM Albums WHERE id=?").run(album.id);
    }
  });
};

function checkEmptyArtists() {
  console.log('checking empty artists')
  var allMedia = db.prepare('SELECT * FROM Artists').all();
  allMedia.forEach(function (artist) {
    var anyArtists = db.prepare('SELECT * FROM Tracks WHERE artist_id=?').all(artist.id);
    if (anyArtists.length === 0) {
      db.prepare("DELETE FROM Artists WHERE id=?").run(artist.id);
    }
  });
};

function checkEmptyGenres() {
  console.log('checking empty genres')
  var allMedia = db.prepare('SELECT * FROM Genres').all();
  allMedia.forEach(function (genre) {
    var anyGenres = db.prepare('SELECT * FROM Tracks WHERE genre_id=?').all(genre.id);
    if (anyGenres.length === 0) {
      db.prepare("DELETE FROM Genres WHERE id=?").run(genre.id);
    }
  });
};

function checkEmptyPlaylists() {
  console.log('checking empty playlists')
  var allPlayslits = db.prepare('SELECT * FROM Playlists').all();
  allPlayslits.forEach(function (playlist) {
    var anyTracks = db.prepare('SELECT * FROM PlaylistTracks WHERE id=?').all(playlist.id);
    if (anyTracks.length === 0) {
      db.prepare("DELETE FROM Playlists WHERE id=?").run(playlist.id);
    }
  });
};

function checkExtraAlbumArt() {
  console.log('checking extra art')
  if (!fs.existsSync(process.env.COVER_ART)) {
    fs.mkdirSync(process.env.COVER_ART);
  }

  fs.readdir(process.env.COVER_ART, function (err, items) {
    items.forEach(function (file) {
      var anyArt = db.prepare('SELECT * FROM CoverArt WHERE id=?').all(file.replace('.jpg', ''));
      if (anyArt.length === 0) del.sync(path.join(process.env.COVER_ART, file));
    });
  });

  var allCoverArt = db.prepare('SELECT * FROM CoverArt').all();
  allCoverArt.forEach(function (art) {
    var anyArt = db.prepare('SELECT * FROM Tracks WHERE cover_art=?').all(art.id);
    if (anyArt.length === 0) {
      db.prepare("DELETE FROM CoverArt WHERE id=?").run(art.id);
      var coverId = 'cvr_' + art.album_id;
      var coverFile = path.join(process.env.COVER_ART, coverId + '.jpg');
      del.sync(coverFile);
    }
  });
};

function checkBasePathSortOrder() {
  console.log('checking base sort order')
  var allBasePaths = db.prepare('SELECT DISTINCT * FROM BasePaths ORDER BY base_path COLLATE NOCASE ASC').all();
  for (var i = 0; i < allBasePaths.length; ++i) {
    db.prepare("UPDATE BasePaths SET sort_order=? WHERE base_id=?").run(i, allBasePaths[i].base_id);
  }
};

function checkCounts() {
  console.log('checking counts')
  var bases = db.prepare('SELECT DISTINCT * FROM BasePaths ORDER BY base_path COLLATE NOCASE ASC').all();
  bases.forEach(b => {
    var tracks = db.prepare('SELECT * FROM Tracks WHERE base_id=?').all(b.base_id);
    db.prepare("UPDATE BasePaths SET track_count=? WHERE base_id=?").run(tracks.length, b.base_id);
  });

  var artists = db.prepare('SELECT * FROM Artists').all();
  artists.forEach(a => {
    var tracks = db.prepare('SELECT * FROM Tracks WHERE base_id=?').all(a.base_id);
    db.prepare("UPDATE Artists SET track_count=? WHERE id=?").run(tracks.length, a.id);
  });

  var albums = db.prepare('SELECT * FROM Albums').all();
  albums.forEach(a => {
    var tracks = db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(a.id);
    db.prepare("UPDATE Albums SET track_count=? WHERE id=?").run(tracks.length, a.id);
  });

  var genres = db.prepare('SELECT * FROM Genres').all();
  genres.forEach(g => {
    var tracks = db.prepare('SELECT * FROM Tracks WHERE genre_id=?').all(g.id);
    db.prepare("UPDATE Genres SET track_count=? WHERE id=?").run(tracks.length, g.id);
  });
};

function processQueue(input, cb) {

  if (shouldCancel()) return;
  var track = input;
  processMetadata(track.path).then(function (metadata) {
    if (shouldCancel()) return;
    updateStatus("scanning", true);
    track = checkExistingTrack(track, metadata);
    track = getBaseInformation(track);
    track = getArtistInformation(track);
    track = getGenreInformation(track);
    track = getAlbumInformation(track);
    track = getMediaInfo(track, metadata);
    writeTrack(track);
    cb(null, track);
  });






};

function processMetadata(file) {
  return mm.parseFile(file, { native: false, skipCovers: false });
};

function updateStatus(status, isScanning) {
  scanStatus.status = status;
  scanStatus.isScanning = isScanning;
  scanStatus.totalFiles = totalFiles;
  scanStatus.currentlyScanned = totalFiles - filteredFiles.length;
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
  scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };
};

function checkMissingMedia() {
  console.log('checking missing media')
  var allMedia = db.prepare('SELECT * FROM Tracks').all();
  allMedia.forEach(function (track) {
    if (!fs.existsSync(track.path)) {
      db.prepare("DELETE FROM Tracks WHERE id=?").run(track.id);
    }
  });
};

function fullScan() {
  updateStatus('Starting full rescan', true);
  cleanup();

  var mediaPaths = db.prepare('SELECT * FROM MediaPaths').all();

  filteredFiles = [];


  mediaPaths.forEach(mediaPath => {
    if (shouldCancel()) return;
    const files = klawSync(mediaPath.path, { nodir: true })
    files.forEach(function (file) {
      if (shouldCancel()) return;
      if (utils.isFileValid(file.path)) {
        var track = new structures.Song();
        track.path = file.path;
        var stats = fs.statSync(track.path);
        track.content_type = mime.lookup(track.path);
        track.size = stats.size;
        track.created = stats.ctime.getTime();
        track.last_modified = stats.mtime.getTime();
        filteredFiles.push(track);
        q.push(track);
      }
    });
  });

  totalFiles = filteredFiles.length;

  updateStatus('Starting scan of ' + totalFiles, true);
};

function quickScan() {
  updateStatus('Starting quick rescan', true);
  var mediaPaths = db.prepare('SELECT * FROM MediaPaths').all();

  filteredFiles = [];

  mediaPaths.forEach(mediaPath => {
    if (shouldCancel()) return;
    const files = klawSync(mediaPath.path, { nodir: true })
    files.forEach(function (file) {
      if (shouldCancel()) return;
      if (utils.isFileValid(file.path)) {
        var anyTracks = db.prepare('SELECT * FROM Tracks WHERE path=?').all(file.path);
        if (anyTracks.length === 0) {
          var track = new structures.Song();
          track.path = file.path;
          var stats = fs.statSync(track.path);
          track.content_type = mime.lookup(track.path);
          track.size = stats.size;
          track.created = stats.ctime.getTime();
          track.last_modified = stats.mtime.getTime();
          filteredFiles.push(track);
          q.push(track);
        }
      }
    });
  });

  totalFiles = filteredFiles.length;
  updateStatus('Starting scan of ' + totalFiles, true);
};

function cancel() {
  if (isScanning()) {
    scanStatus.shouldCancel = true;
    updateStatus('Starting cancel', false);
  }
  else {
    updateStatus("Cancelled scanning", false);
  }
};

function cleanup() {
  checkMissingMedia();
  checkEmptyAlbums();
  checkEmptyArtists();
  checkEmptyGenres();
  checkEmptyPlaylists();
  checkExtraAlbumArt();
  checkBasePathSortOrder();
  checkCounts();
  console.log('incremental cleanup complete');
};

MediaScanner.prototype.cancelScan = function cancelScan() {
  console.log('cancelScan');
  cancel();
};

MediaScanner.prototype.incrementalCleanup = function incrementalCleanup() {
  if (isScanning()) {
    console.log('scan in progress');
  } else {
    console.log('incrementalCleanup');
    cleanup();
  }
};

MediaScanner.prototype.startFullScan = function startScan() {
  if (isScanning()) {
    console.log('scan in progress');
  } else {
    console.log('startFullScan');
    fullScan();
  }
};

MediaScanner.prototype.startQuickScan = function startQuickScan() {
  if (isScanning()) {
    console.log('scan in progress');
  } else {
    console.log('startQuickScan');
    quickScan();
  }
};

MediaScanner.prototype.getStatus = function getStatus() {
  return scanStatus;
};

module.exports = MediaScanner;