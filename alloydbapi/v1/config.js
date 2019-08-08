var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var express = require("express");
var router = express.Router();
var { ipcRenderer } = require("electron");
var structures = require("../../common/structures");
const drivelist = require("drivelist");
var utils = require("../../common/utils");

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

  try {
    res.json(addMediaPath(res.locals.db, displayName, mPath));
  } catch (err) {
    res.locals.debug("api/config/mediapaths");
    res.locals.error(err);
    res.send(new structures.StatusResult("failed"));
  }
});

ipcRenderer.on("config-add-media-path", (args, data) => {
  try {
    addMediaPath(module.exports.db, data.display_name, data.path);
  } catch (err) {

  }
});


var removeMediaPath = function (db, displayName, mPath) {
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
  try {
    res.json(removeMediaPath(res.locals.db, displayName, mPath));
  } catch (err) {
    res.locals.debug("api/config/mediapaths");
    res.locals.error(err);
    res.send(new structures.StatusResult("failed"));
  }

});

ipcRenderer.on("config-remove-media-path", (args, data) => {
  removeMediaPath(module.exports.db, data.display_name, data.path);
});

var getPath = function (query) {
  return new Promise((resolve, reject) => {
    if (!query) {
      drivelist.list().then((drives) => {
        drives.forEach((drive) => {
          if (drive.mountpoints[0]) { drive.path = drive.mountpoints[0].path; }
          drive.size = utils.toHumanReadable(drive.size);
        });
        resolve(drives);
      });

    } else {
      var currentDir = path.normalize(query);
      fs.readdir(currentDir, function (err, files) {
        if (err) {
          reject(err);
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
            reject(e);
          }
        });
        data = _.sortBy(data, function (f) {
          return f.Name;
        });
        resolve(data);
      });
    }
  });
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
    getPath(query).then((result) => {
      res.json(result);
    }).catch((err) => {
      res.locals.error(err);
    });
  } catch (e) {
    if (e) {
      res.locals.error(e);
    }
  }
});

ipcRenderer.on("config-get-file-list", (args, data) => {
  try {
    getPath(data).then((result) => {
      ipcRenderer.send("config-file-list", result);
    }).catch((err) => {
      ipcRenderer.send("log", { level: "error", label: "/config/file_list", message: err.message });
      ipcRenderer.send("log", { level: "error", label: "/config/file_list", message: err.stack });
    });

  } catch (e) {
    if (e) {
      ipcRenderer.send("log", { level: "error", label: "/config/file_list", message: e.message });
      ipcRenderer.send("log", { level: "error", label: "/config/file_list", message: e.stack });
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