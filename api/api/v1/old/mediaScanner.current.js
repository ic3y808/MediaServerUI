'use strict';
var cp = require('child_process');
var scanStatus = { status: '', isScanning: false, shouldCancel: false, totalFiles: 0, currentlyScanned: 0 };

function MediaScannerWrapper() {
  this.process = null;
}

MediaScannerWrapper.prototype.runScript = function runScript() {
  var that = this;
  if (that.process === null) {
    that.process = cp.fork(`${__dirname}/mediaScannerWorker.js`, { execArgv: ['--inspect'] });

    that.process.on('error', function (err) {
      if (err) console.log(err);
    });

    that.process.on('stdout', function (stdout) {
      if (stdout) console.log(stdout);
    });

    that.process.on('stderr', function (err) {
      if (err) console.log(err);
    });

    that.process.on('exit', function (code) {
      that.process = null;
      var err = code === 0 ? null : new Error('exit code ' + code);
      if (err) console.log(err);
    });

    that.process.on('message', function (m) {
      if (m.scanStatus) {
        scanStatus = m.scanStatus;
      } else 
        console.log(m);
    });
  }

}

MediaScannerWrapper.prototype.sendMessage = function sendMessage(message) {
  if (this.process) this.process.send(message);
}

MediaScannerWrapper.prototype.startFullScan = function startFullScan() {
  console.log('starting media scanner worker for full scan')
  this.runScript();
  this.sendMessage({ status: 'full_rescan', db_path: process.env.DATABASE, image_dir: process.env.COVER_ART });
}

MediaScannerWrapper.prototype.startQuickScan = function startQuickScan() {
  console.log('starting media scanner worker for quick scan')
  this.runScript();
  this.sendMessage({ status: 'quick_rescan', db_path: process.env.DATABASE, image_dir: process.env.COVER_ART });
}

MediaScannerWrapper.prototype.getStatus = function getStatus() {
  return scanStatus;
}

MediaScannerWrapper.prototype.cancelScan = function cancelScan() {
  console.log('Cancelling worker scan')
  this.runScript();
  this.sendMessage({ status: 'cancel_rescan' });
}

MediaScannerWrapper.prototype.incrementalCleanup = function incrementalCleanup() {
  console.log('Starting worker Incremental Cleanup')
  this.runScript();
  this.sendMessage({ status: 'incremental_cleanup', db_path: process.env.DATABASE, image_dir: process.env.COVER_ART });
}


module.exports = MediaScannerWrapper;
