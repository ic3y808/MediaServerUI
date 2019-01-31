var express = require('express');
var router = express.Router();
var structures = require('./structures');

var fs = require('fs');
var klawSync = require('klaw-sync');
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
router.get('/ping', function (req, res) {
  // if (req.query.api_key !== process.env.API_KEY) return res.sendStatus(401);
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
router.get('/scheduler', function (req, res) {
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
router.get('/license', function (req, res) {
  var license = new structures.License("test");
  res.send(license);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/start_full_scan
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Starts a new library rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/start_full_scan', function (req, res) {
  res.send(new structures.StatusResult(res.locals.mediaScanner.startFullScan()));
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/start_quick_scan
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Starts a new library rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/start_quick_scan', function (req, res) {
  res.send(new structures.StatusResult(res.locals.mediaScanner.startQuickScan()));
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
router.get('/scan_status', function (req, res) {
  var status = new structures.StatusResult(res.locals.mediaScanner.getStatus())
  res.send(status);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /system/cancel_scan
 * @produces application/json
 * @consumes application/json
 * @group system - System API 
 * @returns {StatusResult} 200 - Cancels the current rescan
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/cancel_scan', function (req, res) {
  var status = new structures.StatusResult(res.locals.mediaScanner.cancelScan())
  res.send(status);
});

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
router.get('/stats', function (req, res) {
  var libraryStats = new structures.LibraryStats()

  var tracks = res.locals.db.prepare('SELECT * FROM Tracks').all();
  libraryStats.track_count = tracks.length;

  var artists = res.locals.db.prepare('SELECT * FROM Artists').all();
  libraryStats.artist_count = artists.length;

  var albums = res.locals.db.prepare('SELECT * FROM Albums').all();
  libraryStats.album_count = albums.length;

  var genres = res.locals.db.prepare('SELECT * FROM Genres').all();
  libraryStats.genre_count = genres.length;

  var dirs = res.locals.db.prepare('SELECT * FROM BasePaths').all();
  libraryStats.folder_count = dirs.length;

  var stmt = res.locals.db.prepare('SELECT SUM(size) FROM Tracks');
  stmt.columns().map(column => column.name);
  for (var row of stmt.iterate()) {
    libraryStats.memory_used = row['SUM(size)'];
  }

  var thresh = 1000;
  if (Math.abs(libraryStats.memory_used) < thresh) {
    libraryStats.memory_used = libraryStats.memory_used + ' B';
  } else {
    var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var u = -1;
    do {
      libraryStats.memory_used /= thresh;
      ++u;
    } while (Math.abs(libraryStats.memory_used) >= thresh && u < units.length - 1);
    libraryStats.memory_used = libraryStats.memory_used.toFixed(1) + ' ' + units[u];
  }

  res.json(libraryStats);
});

module.exports = router;