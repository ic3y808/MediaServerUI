var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");
var { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var shell = require("shelljs");
var klawSync = require("klaw-sync");
// eslint-disable-next-line prefer-const

/**
 * This function comment is parsed by doctrine
 * @route GET /system/ping
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {Ping} 200 - Pings the server and returns the status
 * @returns {Error}  default - Unexpected error
 * @returns {Ping.model}  default - Unexpected error
 * @returns {Ping} Ping - A server Ping object
 * @security ApiKeyAuth
 */
router.get("/ping", function (req, res) {

  // if (req.query.api_key !== process.env.API_KEY) return res.sendStatus(401);
  res.locals.ipc.send("api-test", "test from api");
  var ping = new structures.Ping("success");
  res.send(ping);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/scheduler
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/scheduler", function (req, res) {

  res.json(res.locals.scheduler.getSchedule());
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/license
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {License} 200 - Returns the current license
 * @returns {Error}  default - Unexpected error
 * @returns {License.model}  default - Unexpected error
 * @returns {License} License - A License object
 * @security ApiKeyAuth
 */
router.get("/license", function (req, res) {

  var license = new structures.License("test");
  res.send(license);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/scan_start
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Starts a new library rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/scan_start", function (req, res) {

  if (ipcRenderer) { ipcRenderer.send("mediascanner-scan-start"); }
  res.locals.notify("Rescan Requested", "Full recan requested through API");
  res.send(new structures.StatusResult(res.locals.mediaScanner.startScan()));
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/scan_status
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Gets the current rescan status
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/scan_status", function (req, res) {

  var status = new structures.StatusResult("todo");
  res.send(status);
});


/**
 * This function comment is parsed by doctrine
 * @route GET /system/scan_cancel
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Cancels the current rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */

function calculateMemory(val) {
  var thresh = 1000;
  if (val == undefined || val === null || val === 0) {return  "0 B";}
  if (Math.abs(val) < thresh) {
    return val + " B";
  } else {
    var units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var u = -1;
    do {
      val /= thresh;
      ++u;
    } while (Math.abs(val) >= thresh && u < units.length - 1);
    return val.toFixed(1) + " " + units[u];
  }
}
router.get("/scan_cancel", function (req, res) {

  if (ipcRenderer) { ipcRenderer.send("mediascanner-scan-cancel"); }
  var status = new structures.StatusResult(res.locals.mediaScanner.cancelScan());
  res.send(status);
});
if (ipcRenderer) {
  ipcRenderer.on("system-scan-cancel", (args, data) => {
    ipcRenderer.send("mediascanner-scan-cancel");
  });
}

function getStats(db) {
  var libraryStats = new structures.LibraryStats();

  var tracks = db.prepare("SELECT * FROM Tracks").all();
  libraryStats.track_count = tracks.length;

  var artists = db.prepare("SELECT * FROM Artists").all();
  libraryStats.artist_count = artists.length;

  var albums = db.prepare("SELECT * FROM Albums").all();
  libraryStats.album_count = albums.length;

  var genres = db.prepare("SELECT * FROM Genres").all();
  libraryStats.genre_count = genres.length;

  var stmt = db.prepare("SELECT SUM(size) FROM Tracks");
  stmt.columns().map((column) => column.name);
  for (var row of stmt.iterate()) {
    libraryStats.memory_used = row["SUM(size)"];
  }

  var stats = db.prepare("SELECT * FROM Stats WHERE id=0").get();
  libraryStats.total_requests = stats.tracks_served;
  libraryStats.total_data_served = calculateMemory(stats.data_sent);
  libraryStats.memory_used = calculateMemory(libraryStats.memory_used);

  return libraryStats;
}
/**
 * This function comment is parsed by doctrine
 * @route GET /system/stats
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {LibraryStats} 200 - Returns the current library stats
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/stats", function (req, res) {
  res.json(getStats(res.locals.db));
});
if (ipcRenderer) {
  ipcRenderer.on("system-get-stats", (args, data) => {
    ipcRenderer.send("system-stats", getStats(module.exports.db));
  });
}
/**
 * @route GET /system/do_backup
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Cancels the current rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/do_backup", function (req, res) {

  res.locals.notify("Starting Backup", "Backup requested");
  res.locals.backup.doBackup().then(() => {
    console.log("Backup Complete");
    res.send(new structures.StatusResult("success"));
  }).catch((err) => {
    console.log(JSON.stringify(err));
    res.send(new structures.StatusResult("failed"));
  });
});

/**
 * @route POST /system/do_restore
 * @group system - System API 
 * @returns {StatusResult} 200 - Cancels the current rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.post("/do_restore", function (req, res) {

  res.locals.notify("Restoring backup", "Restore requested");
  console.log("Restore requested");
  res.locals.db.close();
  var dbPath = process.env.DATABASE;
  var dbWalPath = process.env.DATABASE_WAL;
  var dbShmPath = process.env.DATABASE_SHM;
  var sampleFile = req.files.data;
  var restoreFile = path.join(process.env.BACKUP_DATA_DIR, sampleFile.name);
  setTimeout(() => {
    sampleFile.mv(restoreFile, function (err) {
      if (err) { return res.status(500).send(err); }

      if (fs.existsSync(dbPath)) { fs.renameSync(dbPath, dbPath + ".old"); }
      if (fs.existsSync(dbWalPath)) { fs.renameSync(dbWalPath, dbWalPath + ".old"); }
      if (fs.existsSync(dbShmPath)) { fs.renameSync(dbShmPath, dbShmPath + ".old"); }

      fs.renameSync(restoreFile, dbPath);

      console.log("shutting down.... restart server");
      setTimeout(() => {
        process.exit(0);
      }, 5000);
      res.send(new structures.StatusResult("success"));
    });
  }, 1000);

});

module.exports = router;
module.exports.db = {};