"use strict";
var Lastfm = require("./simple-lastfm");
var logger = require("../../../common/logger");

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
    var lastfmSettings = this.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
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
        logger.error("alloydb", "Could not parse settings.");
        updateStatus("Could not parse settings.", false);
      }
    } else {
      logger.error("alloydb", "Could not load lastfm settings.");
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

        var sql = "INSERT OR REPLACE INTO Tracks (";

        Object.keys(track).forEach(function (key, index) {
          if (index == Object.keys(track).length - 1)
            sql += key;
          else
            sql += key + ", ";
        });



        sql += ") VALUES (";


        Object.keys(track).forEach(function (key, index) {
          if (index == Object.keys(track).length - 1)
            sql += "@" + key;
          else
            sql += "@" + key + ", ";
        });

        sql += ")";


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
      logger.info("alloydb", "Writing Database");
    });
    insertMany(this.currentQueue);
  }
};

LastFMScanner.prototype.step = function step() {

  //if (this.scanStatus.shouldCancel) return;
  var track = this.filteredFiles.shift();
  if (!track || !track.path) {
    this.updateStatus("Scanning Complete", false);
  } else {
    try {
      this.getLastfmSession(() => {
        this.getLastFm().getTrackInfo({
          artist: track.artist === "No Artist" ? track.base_path : track.artist,
          track: track.title,
          mbid: track.musicbrainz_artistid,
          callback: result => {
            track.last_fm_info = JSON.stringify(result.trackInfo);
            this.currentQueue.push(track);

            if (this.scanStatus.currentlyScanned === this.totalFiles) {
              this.writeQueue(true);
              this.updateStatus("Scanning Complete", false);
              setTimeout(function () {
                this.resetStatus();
              }, 5000)
            }
            else {
              this.writeQueue(false);
              if (this.filteredFiles.length > 0) { this.step(); }
              else {
                this.updateStatus("Scanning Complete", false);
              }
            }
          }
        });
      });
    } catch (err) {
      this.updateStatus("Scanning Error " + err.message, false);
      if (this.filteredFiles.length > 0) { this.step(); }
      else {
        this.updateStatus("Scanning Complete", false);
      }
    }
  }
};

LastFMScanner.prototype.rescan = function rescan() {
  this.filteredFiles = [];
  this.currentQueue = [];

  this.filteredFiles = this.db.prepare("SELECT * from Tracks WHERE last_fm_info IS NULL").all();

  this.totalFiles = this.filteredFiles.length;

  if (this.totalFiles < this.maxFilesProcessing) {
    for (var i = 0; i < this.totalFiles; i++) {
      this.step();
    }
  }
  else {
    for (var i = 0; i < this.maxFilesProcessing; i++) {
      this.step();
    }
  }
}

LastFMScanner.prototype.startScan = function startScan() {
  if (this.scanStatus && this.scanStatus.isScanning) {
    return "Scan already in progress, use cancel_scan first";
  }

  this.updateStatus("Starting Scan", true);

  new Promise((resolve, reject) => {
    this.rescan();
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
  this.scanStatus = { status: "", isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };
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