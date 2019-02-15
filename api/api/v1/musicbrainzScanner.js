'use strict';
var mb = require('./musicbrainz');
var logger = require('../../../common/logger');

function MusicbrainzScanner(db) {
  this.db = db;
  this.filteredFiles = [];
  this.currentQueue = [];
  this.lastfm = null;
  this.queueProcessSize = 25;
  this.maxFilesProcessing = 2;
  this.resetStatus();
}


MusicbrainzScanner.prototype.writeQueue = function writeQueue(force) {
  if (this.currentQueue.length >= this.queueProcessSize || (force === true && this.currentQueue.length > 0)) {
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
          logger.error("alloydb", JSON.stringify(err));
          logger.error("alloydb", sql);

        }

      }
      this.currentQueue = [];
      logger.info("alloydb", 'writing database');
    });
    insertMany(this.currentQueue);
  }
};

MusicbrainzScanner.prototype.step = function step() {
  var that = this;
  //if (that.scanStatus.shouldCancel) return;
  var track = that.filteredFiles.shift();
  if (!track || !track.path) {
    that.updateStatus("Scanning Complete", false);
  } else {
    try {



      mb.searchReleases(track.album, { country: 'US' }, function (err, releases) {
        console.log(releases);
      });
      mb.searchRecordings(track.title, { artist: track.artist }, function (err, recordings) {

        if (err) console.log(err);
        if (recordings) console.log(JSON.stringify(recordings));

        that.currentQueue.push(track);
        // that.step();






        if (that.scanStatus.currentlyScanned === that.totalFiles) {
          that.writeQueue(true);
          that.updateStatus("Scanning Complete", false);
          setTimeout(function () {
            that.resetStatus();
          }, 5000)
        }
        else {
          that.writeQueue(false);
          if (that.filteredFiles.length > 0) { that.step(); }
          else {
            that.updateStatus("Scanning Complete", false);
          }
        }

      });






    } catch (err) {
      that.updateStatus("Scanning Error " + err.message, false);
      if (that.filteredFiles.length > 0) { that.step(); }
      else {
        that.updateStatus("Scanning Complete", false);
      }
    }
  }
};

MusicbrainzScanner.prototype.rescan = function rescan() {
  var that = this;

  that.filteredFiles = [];
  that.currentQueue = [];

  that.filteredFiles = that.db.prepare('SELECT * from Tracks').all();

  that.totalFiles = that.filteredFiles.length;

  that.step();
}

MusicbrainzScanner.prototype.startScan = function startScan() {
  var that = this;
  if (that.scanStatus && that.scanStatus.isScanning) {
    return "Scan already in progress, use cancel_scan first";
  }

  that.updateStatus('Starting Scan', true);

  new Promise(function (resolve, reject) {
    that.rescan();
  });

  return "Scan started";
};

MusicbrainzScanner.prototype.updateStatus = function updateStatus(status, isScanning) {
  this.scanStatus.status = status;
  this.scanStatus.isScanning = isScanning;
  this.scanStatus.totalFiles = this.totalFiles;
  this.scanStatus.currentlyScanned = this.totalFiles - this.filteredFiles.length;
};

MusicbrainzScanner.prototype.resetStatus = function resetStatus() {
  this.scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };
};

MusicbrainzScanner.prototype.getStatus = function getStatus() {
  return this.scanStatus;
};

MusicbrainzScanner.prototype.cancelScan = function cancelScan() {
  this.scanStatus.shouldCancel = true;
  setTimeout(() => {
    this.resetStatus();
  }, 3000);
  return "Started cancel process";
};

MusicbrainzScanner.prototype.incrementalScan = function incrementalCleanup() {
  this.rescan();
};

module.exports = MusicbrainzScanner;