const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const watch = require("node-watch");
const uuidv3 = require("uuid/v3");
const parser = require("xml2json");
const klawSync = require("klaw-sync");
const escape = require("escape-string-regexp");
const { ipcRenderer } = require("electron");
var Queue = require("better-queue");
var utils = {};
var structures = {};
var MediaScannerBase = {};
var mm = {};
var watchers = [];
var currentQueue = [];
var scanner = {};

class MediaScanner extends MediaScannerBase {
  constructor() {
    super(require("better-sqlite3")(process.env.DATABASE));
    this.db.pragma("journal_mode = WAL");
    process.on("exit", () => { this.db.close(); });
    process.on("SIGHUP", () => process.exit(128 + 1));
    process.on("SIGINT", () => process.exit(128 + 2));
    process.on("SIGTERM", () => process.exit(128 + 15));
    //this.configureQueue();
    //this.configFileWatcher();
    ipcRenderer.send("mediascanner-loaded-result", "success");
    this.info("Mediascanner Started");
  }

  getMediaFiles() {
    var mediaPaths = this.db.prepare("SELECT * FROM MediaPaths").all();

    if (mediaPaths.length === 0) {
      this.updateStatus("No Media Path Defined ", false);
      return null;
    }
    this.updateStatus("Collecting mapped and unmapped artist folders", true);
    this.debug("Collecting mapped and unmapped artist folders");

    mediaPaths.forEach((mediaPath) => {

    });

  }


}


ipcRenderer.on("mediascanner-start", (args, env) => {
  process.env = env;
  utils = require(path.join(process.env.APP_DIR, "common", "utils"));
  structures = require(path.join(process.env.APP_DIR, "common", "structures"));
  MediaScannerBase = require(path.join(process.env.APP_DIR, "alloydbui", "js", "MediaScannerBase"));
  mm = require(path.join(process.env.APP_DIR, "alloydbapi", "music-metadata"));
  scanner = new MediaScanner();
});

ipcRenderer.on("mediascanner-scan-start", () => {
  scanner.startScan();
});

ipcRenderer.on("mediascanner-scan-cancel", () => {
  scanner.cancelScan();
});

ipcRenderer.on("mediascanner-cleaup-start", () => {
  scanner.cleanup();
});

ipcRenderer.on("mediascanner-inc-cleaup-start", () => {
  scanner.incrementalCleanup();
});

ipcRenderer.on("mediascanner-watcher-configure", () => {
  scanner.configFileWatcher();
});

ipcRenderer.on("mediascanner-recache-start", () => {
  scanner.recache();
});