'use strict';
var Lastfm = require('./simple-lastfm');

function LastFMScanner(db) {
  this.db = db;
  this.filteredFiles = [];
  this.currentQueue = [];
  this.lastfm = null;
  this.queueProcessSize = 25;
  this.maxFilesProcessing = 2;
  this.resetStatus();
}

LastFMScanner.prototype.lastfm = {};

LastFMScanner.prototype.getLastFm = function getLastFm() {
  if (this.lastfm !== null) {
    return this.lastfm;
  } else {
    var lastfmSettings = this.db.prepare('SELECT * from Settings WHERE settings_key=?').get('alloydb_settings');
    if (lastfmSettings && lastfmSettings.settings_value) {
      var settings = JSON.parse(lastfmSettings.settings_value);
      if (settings) {
        return this.lastfm = new Lastfm({
          api_key: process.env.LASTFM_API_KEY,
          api_secret: process.env.LASTFM_API_SECRET,
          username: settings.alloydb_lastfm_username,
          password: settings.alloydb_lastfm_password
        });
      } else {
        console.log("Could not parse settings.");
        updateStatus("Could not parse settings.", false);
      }
    } else {
      console.log("Could not load lastfm settings.");
      updateStatus("Could not load lastfm settings.", false);
    }
  }
}

LastFMScanner.prototype.getLastfmSession = function getLastfmSession(cb) {
  this.getLastFm().getSessionKey(cb);
}

LastFMScanner.prototype.writeQueue = function writeQueue(force) {
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
          console.log(err);
          console.log(sql);

        }

      }
      this.currentQueue = [];
      console.log('writing writing database');
    });
    insertMany(this.currentQueue);
  }
};

LastFMScanner.prototype.step = function step() {
  var that = this;
  //if (that.scanStatus.shouldCancel) return;
  var track = that.filteredFiles.shift();
  if (!track || !track.path) {
    that.updateStatus("Scanning Complete", false);
  } else {
    try {
      that.getLastfmSession(() => {
        that.getLastFm().getTrackInfo({
          artist: track.artist === 'No Artist' ? track.base_path : track.artist,
          track: track.title,
          mbid: track.musicbrainz_artistid,
          callback: function (result) {
            track.last_fm_info = JSON.stringify(result.trackInfo);
            that.currentQueue.push(track);

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
          }
        });
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

LastFMScanner.prototype.rescan = function rescan() {
  var that = this;

  that.filteredFiles = [];
  that.currentQueue = [];

  that.filteredFiles = that.db.prepare('SELECT * from Tracks WHERE last_fm_info IS NULL').all();

  that.totalFiles = that.filteredFiles.length;

  if (that.totalFiles < that.maxFilesProcessing) {
    for (var i = 0; i < that.totalFiles; i++) {
      that.step();
    }
  }
  else {
    for (var i = 0; i < that.maxFilesProcessing; i++) {
      that.step();
    }
  }
}

LastFMScanner.prototype.startScan = function startScan() {
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

LastFMScanner.prototype.updateStatus = function updateStatus(status, isScanning) {
  this.scanStatus.status = status;
  this.scanStatus.isScanning = isScanning;
  this.scanStatus.totalFiles = this.totalFiles;
  this.scanStatus.currentlyScanned = this.totalFiles - this.filteredFiles.length;
};

LastFMScanner.prototype.resetStatus = function resetStatus() {
  this.scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };
};

LastFMScanner.prototype.getStatus = function getStatus() {
  return this.scanStatus;
};

LastFMScanner.prototype.cancelScan = function cancelScan() {
  this.scanStatus.shouldCancel = true;
  setTimeout(() => {
    this.resetStatus();
  }, 3000);
  return "Started cancel process";
};

LastFMScanner.prototype.incrementalScan = function incrementalCleanup() {
  this.rescan();
};

module.exports = LastFMScanner;