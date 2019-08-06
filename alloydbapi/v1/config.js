var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var express = require("express");
var router = express.Router();
var { ipcRenderer } = require("electron");
var structures = require("../../common/structures");
const drivelist = require("drivelist");
var utils = require("../../common/utils");
var logger = require("../../common/logger");
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

ipcRenderer.on("config-get-media-paths", (args, data) => {
  ipcRenderer.send("config-media-paths", module.exports.db.prepare("SELECT * FROM MediaPaths").all());
});

var addMediaPath = function (db, displayName, mPath) {
  try {
    const stmt = db.prepare("INSERT INTO MediaPaths (display_name, path) VALUES (?, ?) ON CONFLICT(display_name) DO UPDATE SET path=?");
    const info = stmt.run(displayName, mPath, mPath);
    if (info.changes) {
      ipcRenderer.send("config-media-paths", db.prepare("SELECT * FROM MediaPaths").all());
      ipcRenderer.send("mediascanner-watcher-configure", db.prepare("SELECT * FROM MediaPaths").all());
      return new structures.StatusResult("success");
    } else {
      ipcRenderer.send("config-media-paths", db.prepare("SELECT * FROM MediaPaths").all());
      return new structures.StatusResult(info);
    }
  } catch (err) {
    logger.error("api/config/addMediaPath", err);
    return new structures.StatusResult("failed");
  }
};

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
  var mPath = req.query.path;
  res.json(addMediaPath(res.locals.db, displayName, mPath));
});

ipcRenderer.on("config-add-media-path", (args, data) => {
  addMediaPath(module.exports.db, data.display_name, data.path);
});


var removeMediaPath = function (db, displayName, mPath) {
  try {
    const stmt = db.prepare("DELETE FROM MediaPaths WHERE display_name=? AND path=?");
    const info = stmt.run(displayName, mPath);
    if (info.changes) {
      ipcRenderer.send("config-media-paths", db.prepare("SELECT * FROM MediaPaths").all());
      ipcRenderer.send("mediascanner-watcher-configure", db.prepare("SELECT * FROM MediaPaths").all());
      return new structures.StatusResult("success");
    } else {
      ipcRenderer.send("config-media-paths", db.prepare("SELECT * FROM MediaPaths").all());
      return new structures.StatusResult("nochange");
    }
  } catch (err) {
    logger.error("api/config/removeMediaPath", err);
    return new structures.StatusResult("Failed");
  }
};

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
  var mPath = req.query.path;
  res.json(removeMediaPath(res.locals.db, displayName, mPath));
});

ipcRenderer.on("config-remove-media-path", (args, data) => {
  removeMediaPath(module.exports.db, data.display_name, data.path);
});


var getPath = function (query, cb) {
  if (!query) {
    drivelist.list().then((drives) => {
      drives.forEach((drive) => {
        if (drive.mountpoints[0]) { drive.path = drive.mountpoints[0].path; }
        drive.size = utils.toHumanReadable(drive.size);
      });
      cb(drives);
    });

  } else {
    var currentDir = path.normalize(query);
    fs.readdir(currentDir, function (err, files) {
      if (err) {
        logger.error("api/config/getPath", err);
        return;
      }
      var data = [];
      files.forEach(function (file) {
        try {
          var isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory();
          if (isDirectory) {
            data.push({
              Name: file,
              IsDirectory: true,
              Path: path.join(query, file)
            });
          }
        } catch (e) {
          logger.error("api/config/getPath", e);
        }
      });
      data = _.sortBy(data, function (f) {
        return f.Name;
      });
      cb(data);
    });
  }
};

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
    getPath(query, (result) => {
      res.json(result);
    });

  } catch (e) {
    if (e) {
      logger.error("api/config/file_list", e);
    }
  }
});

ipcRenderer.on("config-get-file-list", (args, data) => {
  try {
    getPath(data, (result) => {
      ipcRenderer.send("config-file-list", result);
    });

  } catch (e) {
    if (e) {
      logger.error("api/config/config-get-file-list", e);
      ipcRenderer.send("config-file-list", e.message);
    }
  }
});


var getFileParent = function (query) {
  var newPath = path.dirname(query);
  if (query === newPath) { return { path: "" }; }
  else { return { path: newPath }; }
};


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
  res.json(getFileParent(query));
});

ipcRenderer.on("config-get-file-parent", (args, data) => {
  ipcRenderer.send("config-file-parent", getFileParent(data));
});


module.exports = router;
module.exports.db = {};