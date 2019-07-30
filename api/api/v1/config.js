var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var express = require("express");
var router = express.Router();
var structures = require("./structures");
const drivelist = require("drivelist");
var utils = require("./utils");
var logger = require("../../../common/logger");

/**
 * This function comment is parsed by doctrine
 * @route GET /config/mediapaths
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @returns {MediaPath} 200 - An array of MediaPath objects which represent the library paths
 * @returns {Error}  default - Unexpected error
 * @returns {MediaPath.model}  default - Unexpected error
 * @returns {MediaPath} Ping - A MediaPath object
 * @security ApiKeyAuth
 */
router.get("/mediapaths", function (req, res) {
  res.json(res.locals.db.prepare("SELECT * FROM MediaPaths").all());
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /config/mediapaths
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @param {string} path.query.required
 * @param {string} display_name.query.required
 * @returns {MediaPath} 200 - An array of MediaPath objects which represent the library paths
 * @returns {Error}  default - Unexpected error
 * @returns {MediaPath.model}  default - Unexpected error
 * @returns {MediaPath} Ping - A MediaPath object
 * @security ApiKeyAuth
 */
router.put("/mediapaths", function (req, res) {
  var displayName = req.query.display_name;
  var path = req.query.path;
  try {
    const stmt = res.locals.db.prepare(
      "INSERT INTO MediaPaths (display_name, path) VALUES (?, ?) ON CONFLICT(display_name) DO UPDATE SET path=?"
    );
    const info = stmt.run(displayName, path, path);
    if (info.changes) {
      res.locals.watcher.configFileWatcher();
      res.json(new structures.StatusResult("success"));
    } else { res.json(new structures.StatusResult(info)); }
  } catch (err) {
    res.json(new structures.StatusResult(failed));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route DELETE /config/mediapaths
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @param {string} path.query
 * @param {string} display_name.query
 * @returns {Status} 200 - Returns the status of the delete
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete("/mediapaths", function (req, res) {
  var displayName = req.query.display_name ? req.query.display_name : "";
  var path = req.query.path;

  try {
    const stmt = res.locals.db.prepare(
      "DELETE FROM MediaPaths WHERE display_name=? AND path=?"
    );
    const info = stmt.run(displayName, path);
    if (info.changes) {
      res.locals.watcher.configFileWatcher();
      res.json(new structures.StatusResult("success"));
    } else { res.json(new structures.StatusResult("nochange")); }
  } catch (err) {
    res.json(new structures.StatusResult("Failed"));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /config/file_list
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @param {string} path.query
 * @returns {Status} 200 - Returns the status of the delete
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/file_list", function (req, res) {
  try {
    var query = req.query.path || "";
    if (!query) {

      drivelist.list((error, drives) => {
        if (error) {
          res.json(new structures.StatusResult(error));
        } else {
          drives.forEach((drive) => {
            drive.path = drive.mountpoints[0].path;
            drive.size = utils.toHumanReadable(drive.size);
          });
          res.json(drives);
        }
      });

    } else {
      var currentDir = path.normalize(query);
      fs.readdir(currentDir, function (err, files) {
        if (err) {
          throw err;
        }
        var data = [];
        files.forEach(function (file) {
          try {
            var isDirectory = fs
              .statSync(path.join(currentDir, file))
              .isDirectory();
            if (isDirectory) {
              data.push({
                Name: file,
                IsDirectory: true,
                Path: path.join(query, file)
              });
            }
          } catch (e) {
            if (e) { logger.error("alloydb", JSON.stringify(e)); }
          }
        });
        data = _.sortBy(data, function (f) {
          return f.Name;
        });
        res.json(data);
      });
    }
  } catch (e) {
    if (e) { logger.error("alloydb", JSON.stringify(e)); }
    res.json(new structures.StatusResult(JSON.stringify(e)));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /config/file_parent
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @param {string} path.query
 * @returns {Status} 200 - Returns the parent path from the input
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/file_parent", function (req, res) {
  var query = req.query.path || "";
  var newPath = path.dirname(query);
  if (query === newPath) { res.json({ path: "" }); }
  else { res.json({ path: newPath }); }
});

module.exports = router;
