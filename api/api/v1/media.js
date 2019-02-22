'use strict';
var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs');
var structures = require('./structures');
var logger = require('../../../common/logger');

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
          const rstream = fs.createReadStream(track[0].path, {
            start: start,
            end: end
          });

          res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
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
 * @param {string} artist_id.query The ID of a song, album or artist.
 * @param {string} track_id.query The ID of a song, album or artist.
 * @param {string} album_id.query The ID of a song, album or artist.
 * @param {string} size.query If specified, scale image to this size.
 * @returns {BinaryType} 200 - Returns the cover art image in binary form.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get('/cover_art', function (req, res) {
  var artist_id = req.query.artist_id;
  var track_id = req.query.track_id;
  var album_id = req.query.album_id;
  var coverFile = '';

  var shuffle = a => {
    for (var i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  if (artist_id) {
    var artist = res.locals.db.prepare('SELECT * FROM Artists WHERE id=?').get(artist_id);
    if (artist && artist.path) {
      if (fs.existsSync(path.join(artist.path, process.env.LOGO_IMAGE))) {
        coverFile = path.join(artist.path, process.env.LOGO_IMAGE);
      }
      if (!coverFile) {
        var artistAlbums = res.locals.db.prepare('SELECT * FROM Albums WHERE artist_id=?').all(artist_id);
        artistAlbums = shuffle(artistAlbums)
        artistAlbums.forEach(album => {
          if (!coverFile) {
            if (fs.existsSync(path.join(album.path, process.env.COVERART_IMAGE))) {
              coverFile = path.join(album.path, process.env.COVERART_IMAGE);
            } else {
              var albumTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
              albumTracks = shuffle(albumTracks)
              albumTracks.forEach(albumTrack => {
                if (!coverFile) {
                  if (fs.existsSync(path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg"))) {
                    coverFile = path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg");
                  }
                }
              });
            }
          }
        });
      }
    }
  } else if (track_id) {
    var track = res.locals.db.prepare('SELECT * FROM Tracks WHERE id=?').get(track_id);
    if (fs.existsSync(path.join(process.env.COVER_ART_DIR, track_id + ".jpg"))) {
      coverFile = path.join(process.env.COVER_ART_DIR, track_id + ".jpg");
    }
    if (!coverFile) {
      var albumTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(track.album_id);
      albumTracks = shuffle(albumTracks)
      albumTracks.forEach(albumTrack => {
        if (!coverFile) {
          if (fs.existsSync(path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg"))) {
            coverFile = path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg");
          }
        }
      });
    }
  } else if (album_id) {
    var albumTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album_id);
    albumTracks = shuffle(albumTracks)
    albumTracks.forEach(albumTrack => {
      if (!coverFile) {
        if (fs.existsSync(path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg"))) {
          coverFile = path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg");
        }
      }
    });
  }

  if (!coverFile) res.sendfile(process.env.COVER_ART_NO_ART);
  else res.sendFile(coverFile);

});


module.exports = router;