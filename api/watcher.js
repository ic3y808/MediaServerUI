const watch = require('node-watch');
const Queue = require('better-queue');
const logger = require("../common/logger");
var watchers = [];
var mediaScanner = {};

class Watcher {
  constructor(database, scanner) {
    this.db = database;
    mediaScanner = scanner;
    this.processingQueue = new Queue(this.fileChange, { concurrent: 1 })
    //this.processingQueue.on('drain', cleanup);
  }

  fileChange(input, cb) {
    if (input.evt === 'update') {
      mediaScanner.scanPath(input.name)
    }

    cb(null, input);
  }

  configFileWatcher() {
    watchers.forEach(watcher => {
      if (!watcher.isClosed()) {
        watchers.close();
      }
    });

    var mediaPaths = this.db.prepare('SELECT * FROM MediaPaths').all();

    if (mediaPaths.length === 0) {
      logger.info('alloydb', 'No Media Path Defined ');
      return;
    }
    mediaPaths.forEach(mediaPath => {
      watchers.push(watch(mediaPath.path, { recursive: true }, (evt, name) => {
        this.processingQueue.push({ evt: evt, name: name })
      }));
    });
  };
}

module.exports = Watcher;