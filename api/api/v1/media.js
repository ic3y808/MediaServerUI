'use strict';
var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs');
var structures = require('./structures');

/**
 * This function comment is parsed by doctrine
 * @route GET /media/stream
 * @produces application/json 
 * @consumes application/json 
 * @group media - Media API
 * @param {string} id.query.required ID of the song
 * @param {string} maxBitRate.query If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.
 * @param {string} format.query Specifies the preferred target format
 * @param {string} estimateContentLength.query If set to "true", the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.
 * @returns {BinaryType} 200 - Returns binary data on success
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/stream', function (req, res) {
  var id = req.query.id;
  var maxBitRate = req.query.maxBitRate;
  var format = req.query.format;
  var estimateContentLength = req.query.estimateContentLength;
  var track = res.locals.db.prepare('SELECT * FROM Tracks WHERE id=?').all(id);
  if (track.length !== 0) {





    const stat = fs.statSync(track[0].path);
    const total = stat.size;
    if (req.headers.range) {
      fs.exists(track[0].path, (exists) => {
        if (exists) {
          const range = req.headers.range;
          const parts = range.replace(/bytes=/, '').split('-');
          const partialStart = parts[0];
          const partialEnd = parts[1];

          const start = parseInt(partialStart, 10);
          const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
          const chunksize = (end - start) + 1;
          const rstream = fs.createReadStream(track[0].path, { start: start, end: end });

          res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': track[0].content_type
          });
          rstream.pipe(res);

        } else {
          res.send('Error - 404');
          res.end();
        }
      });
    } else {
      var rstream = fs.createReadStream(track[0].path);
      rstream.pipe(res);
    }
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /media/download
 * @produces application/json 
 * @consumes application/json 
 * @group media - Media API
 * @param {string} id.query.required ID of the song
 * @returns {BinaryType} 200 - Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/download', function (req, res) {
  var id = req.query.id;

  var track = res.locals.db.prepare('SELECT * FROM Tracks WHERE id=?').all(id);
  if (track.length !== 0) {
    res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(track[0].path));
    res.setHeader('Content-Type', 'application/' + track[0].content_type)
    var rstream = fs.createReadStream(track[0].path);
    rstream.pipe(res);
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /media/cover_art
 * @produces application/json 
 * @consumes application/json 
 * @group media - Media API
 * @param {string} id.query.required The ID of a song, album or artist.
 * @param {string} size.query If specified, scale image to this size.
 * @returns {BinaryType} 200 - Returns the cover art image in binary form.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/cover_art', function (req, res) {
  var id = req.query.id;
  var noArt = path.join(__dirname, 'images', 'no_art.jpg');
  var art = res.locals.db.prepare('SELECT * FROM Tracks WHERE id=? OR cover_art=?').all(id, id);
  if (art.length !== 0) {
    var coverId = 'cvr_' + art[0].album_id;
    var coverFile = path.join(process.env.COVER_ART, coverId + '.jpg');
    if (fs.existsSync(coverFile)) {
      res.sendFile(coverFile);
    } else {
      res.sendFile(noArt);
    }

  } else {
    res.sendFile(noArt);
  }

});


module.exports = router;
