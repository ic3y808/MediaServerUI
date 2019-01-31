'use strict';
var express = require('express');
var router = express.Router();
var structures = require('./structures');

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
router.get('/mediapaths', function (req, res) {
  res.json(res.locals.db.prepare('SELECT * FROM MediaPaths').all());
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /config/mediapaths
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @param {string} path.query.required
 * @param {string} displayName.query.required
 * @returns {MediaPath} 200 - An array of MediaPath objects which represent the library paths
 * @returns {Error}  default - Unexpected error
 * @returns {MediaPath.model}  default - Unexpected error
 * @returns {MediaPath} Ping - A MediaPath object
 * @security ApiKeyAuth
 */
router.put('/mediapaths', function (req, res) {
  var displayName = req.query.displayName;
  var path = req.query.path;
  try {
    const stmt = res.locals.db.prepare('INSERT INTO MediaPaths (display_name, path) VALUES (?, ?) ON CONFLICT(display_name) DO UPDATE SET path=?');
    const info = stmt.run(displayName, path, path);
    if (info.changes) {
      res.json(new structures.StatusResult('Added media path'));
    } else res.json(new structures.StatusResult(info));
  } catch{
    res.json(new structures.StatusResult('Failed'));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route DELETE /config/mediapaths
 * @produces application/json
 * @consumes application/json
 * @group config - Config API
 * @param {string} path.query
 * @param {string} displayName.query
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete('/mediapaths', function (req, res) {
  var displayName = req.query.displayName;
  var path = req.query.path;
  if (displayName) {
    try {
      const stmt = res.locals.db.prepare('DELETE FROM MediaPaths WHERE display_name=?');
      const info = stmt.run(displayName);
      if (info.changes) {
        res.json(new structures.StatusResult('Deleted media path'));
      } else res.json(new structures.StatusResult(info));
    } catch{
      res.json(new structures.StatusResult('Failed'));
    }
  }
  else if (path) {
    try {
      const stmt = res.locals.db.prepare('DELETE FROM MediaPaths WHERE path=?');
      const info = stmt.run(path);
      if (info.changes) {
        res.json(new structures.StatusResult('Deleted media path'));
      } else res.json(new structures.StatusResult(info));
    } catch{
      res.json(new structures.StatusResult('Failed'));
    }
  }
});

module.exports = router;