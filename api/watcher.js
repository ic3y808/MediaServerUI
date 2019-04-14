"use strict";
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const watch = require("node-watch");
const logger = require("../common/logger");
var watchers = [];
var mediaScanner = {};
var currentQueue = [];

class Watcher {
  constructor(database, scanner) {
    this.db = database;
    mediaScanner = scanner;
  }

  startQueue(event) {
    clearTimeout(this.timeout);
    currentQueue.push(event);
    this.timeout = setTimeout(this.processQueue, 5000);
  }

  processQueue() {
    var queue = _.uniq(currentQueue, "name");
    currentQueue = [];
    for (var i = queue.length - 1; i >= 0; --i) {

      mediaScanner.scanPath(queue[i].path);

      queue.splice(i, 1);
    }

    clearTimeout(this.timeout);
  }

  configFileWatcher() {
    watchers.forEach((watcher) => {
      if (!watcher.isClosed()) {
        watcher.close();
      }
    });

    var mediaPaths = this.db.prepare("SELECT * FROM MediaPaths").all();

    if (mediaPaths.length === 0) {
      logger.info("alloydb", "No Media Path Defined ");
      return;
    }
    mediaPaths.forEach((mediaPath) => {
      if (mediaPath.path && fs.existsSync(mediaPath.path)) {
        watchers.push(watch(mediaPath.path, { recursive: true }, (evt, name) => {
          var fileName = name; 
          if (fs.existsSync(fileName)) {
            if (fs.lstatSync(fileName).isDirectory())
              {this.startQueue({ evt: evt, name: fileName, path: fileName });}
            else
              {this.startQueue({ evt: evt, name: path.dirname(fileName), path: fileName });}
          }
        }));
      }
    });
  }
}

module.exports = Watcher;