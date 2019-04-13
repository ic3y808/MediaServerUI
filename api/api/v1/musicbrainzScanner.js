'use strict';

const got = require("got");
const path = require("path");
const Queue = require('better-queue');
const logger = require('../../../common/logger');
const uuidv3 = require('uuid/v3');
var moment = require('moment');

var db = null;
var totalFiles = 0;
var filteredFiles = [];
var scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };

var urlBase = process.env.BRAINZ_API_URL;



function MusicbrainzScanner(database) {
  db = database;
  this.filteredFiles = [];
  resetStatus();
};

function writeDb(data, table) {

  var sql = 'INSERT OR REPLACE INTO ' + table + ' (';

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



  var insert = db.prepare(sql);

  var t = {};
  Object.keys(data).forEach(function (key, index) {
    var a = {};
    a[key] = data[key];
    Object.assign(t, a);
  });

  insert.run(t);
};


function processAlbums(track, result) {
  if (result.Albums) {
    result.Albums.forEach(function (album) {
      var existingAlbum = db.prepare('SELECT * FROM Albums WHERE foreign_id = ?').all(album.foreign_id);

      if (existingAlbum.length === 0) {
        var dbAlbum = {
          foreign_id: album.ArtistId,
          rating: album.Rating.Count,
          name: album.Title,
          created: album.ReleaseDate,
          status: album.ReleaseStatuses[0],
          type: album.Type,
          base_path: track.base_path,
          base_id: track.base_id,
          artist: result.ArtistName,
          artist_id: track.artist_id,
          genre: "No Genre",
          genre_id: ""
        }
        var year = moment(album.ReleaseDate).format("YYYY")
        if (year) year = "(" + year + ")";

        dbAlbum.path = path.dirname(path.dirname(track.path));
        dbAlbum.path = path.join(dbAlbum.path, album.Title + " " + year);
        var tempAlbumId = 'album_' + uuidv3(dbAlbum.path, process.env.UUID_BASE).split('-')[0];
        var stmt = db.prepare('SELECT * FROM Albums WHERE id = ?');
        var existingAlbum = stmt.all(tempAlbumId);
        if (existingAlbum.length === 0) {
          dbAlbum.id = tempAlbumId;
        } else {
          dbAlbum.id = existingAlbum[0].id;
        }

        writeDb(dbAlbum, "Albums")

      }
    });
  }




};

function processLinks(result) {
  if (result.Links) {
    result.Links.forEach(function (link) {
      var existingLink = db.prepare('SELECT * FROM Links WHERE type=? AND target=? AND artist_foreign_id=?').all(link.type, link.target, result.Id);
      if (existingLink.length === 0) {
        link.artist_foreign_id = result.Id;
        writeDb(link, "Links")
      }
    });
  }
}



function processQueue(input, cb) {
  if (shouldCancel()) return;
  var track = input;

  try {
    if (track.artist_foreign_id) {
      var url = urlBase + "/api/v0.3/artist/" + track.artist_foreign_id;


      got(url, { json: true }).then(function (res) {
        var result = res.body;
        console.log("process artist " + track.artist_foreign_id);
        processAlbums(track, result);
        processLinks(result);


        //  writeDb(track, "Albums")
        //  writeDb(album, "Albums")
        cb(null, track);
      });
    } else {
      cb(null, track);
    }
  } catch (err) {
    cb(null, track);
  }

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


function cleanup() {

  resetStatus();
  updateStatus('Scan Complete', false);
}


function cancel() {
  if (isScanning()) {
    scanStatus.shouldCancel = true;
    updateStatus('Starting cancel', false);
  }
  else {
    updateStatus("Cancelled scanning", false);
  }
};


function scan() {
  updateStatus('Starting musicbrainz rescan', true);
  var allTracks = db.prepare('SELECT * FROM Tracks').all();

  filteredFiles = [];

  allTracks.forEach(track => {
    if (shouldCancel()) return;
    filteredFiles.push(track);
    q.push(track);
    updateStatus('Queuing ' + filteredFiles.length, true);
  });

  totalFiles = filteredFiles.length;
  updateStatus('Starting scan of ' + totalFiles, true);
}


MusicbrainzScanner.prototype.cancelScan = function cancelScan() {
  logger.info("alloydb", 'cancelScan');
  cancel();
};

MusicbrainzScanner.prototype.incrementalCleanup = function incrementalCleanup() {
  if (isScanning()) {
    logger.debug("alloydb", 'scan in progress');
  } else {
    logger.info("alloydb", 'incrementalCleanup');

  }
};

MusicbrainzScanner.prototype.startScan = function startScan() {
  if (isScanning()) {
    logger.debug("alloydb", 'scan in progress');
  } else {
    logger.info("alloydb", 'startScan');
    resetStatus();
    scan();
  }
};



MusicbrainzScanner.prototype.getStatus = function getStatus() {
  return scanStatus;
};

var q = new Queue(processQueue)
q.on('drain', cleanup);

module.exports = MusicbrainzScanner;