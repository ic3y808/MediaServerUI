'use strict';
var express = require('express');
var router = express.Router();

/**
 * This function comment is parsed by doctrine
 * @route GET /share/shares
 * @produces application/json 
 * @consumes application/json 
 * @group share - Share API
 * @returns {Array.<Share>} 200 - Returns an array of shares
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/shares', function (req, res) {
  var id = req.query.id;
  var albumId = req.query.albumId;
  var artistId = req.query.artistId;

  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /share/shares
 * @produces application/json 
 * @consumes application/json 
 * @group share - Share API
 * @param {string} id.query.required ID of a song, album or video to share. Use one id parameter for each entry to share.
 * @param {string} description.query A user-defined description that will be displayed to people visiting the shared media.
 * @param {string} expires.query The time at which the share expires. Given as milliseconds since 1970.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put('/shares', function (req, res) {
  var id = req.query.id;
  var description = req.query.description;
  var expires = req.query.expires;

  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route DELETE /share/shares
 * @produces application/json 
 * @consumes application/json 
 * @group share - Share API
 * @param {string} id.query.required ID of a song, album or video to share. Use one id parameter for each entry to share.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete('/shares', function (req, res) {
  var id = req.query.id;

  res.send('respond with a resource');
});

module.exports = router;
