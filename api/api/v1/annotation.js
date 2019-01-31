'use strict';
var express = require('express');
var router = express.Router();
var structures = require('./structures');
var Lastfm = require('./simple-lastfm');

/**
 * This function comment is parsed by doctrine
 * @route PUT /annotation/star
 * @produces application/json 
 * @consumes application/json 
 * @group annotate - Annotation API
 * @param {string} id.query The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.
 * @param {string} album.query The ID of an album to star. Multiple parameters allowed.
 * @param {string} artist.query The ID of an artist to star. Multiple parameters allowed.
 * @param {string} genre.query The ID of a Genre to star. Multiple parameters allowed.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put('/star', function (req, res) {
  var id = req.query.id;
  var album = req.query.album;
  var artist = req.query.artist;
  var genre = req.query.genre;


  if (id) {
    res.locals.db.prepare('UPDATE Tracks SET starred="true" WHERE id=?').run(id);
    res.send(new structures.StatusResult("Updated track"));
  }
  if (album) {
    res.locals.db.prepare('UPDATE Albums SET starred="true" WHERE id=?').run(album);
    res.send(new structures.StatusResult("Updated album"));
  }
  if (artist) {
    if (artist.indexOf('base_') !== -1) {
      res.locals.db.prepare('UPDATE Artists SET starred="true" WHERE base_id=?').run(artist);
      res.locals.db.prepare('UPDATE BasePaths SET starred="true" WHERE base_id=?').run(artist);
    } else if (artist.indexOf('artist_') !== -1) {
      res.locals.db.prepare('UPDATE Artists SET starred="true" WHERE id=?').run(artist);
    }
    res.send(new structures.StatusResult("Updated artist"));
  }
  if (genre) {
    res.locals.db.prepare('UPDATE Genres SET starred="true" WHERE genre_id=?').run(genre);
    res.send(new structures.StatusResult("Updated genre"));
  }

 
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /annotation/unstar
 * @produces application/json 
 * @consumes application/json 
 * @group annotate - Annotation API
 * @param {string} id.query The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.
 * @param {string} album.query The ID of an album to star. Multiple parameters allowed.
 * @param {string} artist.query The ID of an artist to star. Multiple parameters allowed.
 * @param {string} genre.query The ID of a Genre to star. Multiple parameters allowed.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put('/unstar', function (req, res) {
  var id = req.query.id;
  var album = req.query.album;
  var artist = req.query.artist;
  var genre = req.query.genre;


  if (id) {
    res.locals.db.prepare('UPDATE Tracks SET starred="false" WHERE id=?').run(id);
    res.send(new structures.StatusResult("Updated track"));
  }
  if (album) {
    res.locals.db.prepare('UPDATE Albums SET starred="false" WHERE id=?').run(album);
    res.send(new structures.StatusResult("Updated album"));
  }
  if (artist) {
    if (artist.indexOf('base_') !== -1) {
      res.locals.db.prepare('UPDATE Artists SET starred="false" WHERE base_id=?').run(artist);
      res.locals.db.prepare('UPDATE BasePaths SET starred="false" WHERE base_id=?').run(artist);
    } else if (artist.indexOf('artist_') !== -1) {
      res.locals.db.prepare('UPDATE Artists SET starred="false" WHERE id=?').run(artist);
    }
    res.send(new structures.StatusResult("Updated artist"));
  }
  if (genre) {
    res.locals.db.prepare('UPDATE Genres SET starred="false" WHERE genre_id=?').run(genre);
    res.send(new structures.StatusResult("Updated genre"));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /annotation/set_rating
 * @produces application/json 
 * @consumes application/json 
 * @group annotate - Annotation API
 * @param {string} id.query.required A string which uniquely identifies the file (song) or folder (album/artist) to rate.
 * @param {string} rating.query.required The rating between 1 and 5 (inclusive), or 0 to remove the rating.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put('/set_rating', function (req, res) {
  var id = req.query.id;
  var rating = req.query.rating;

  if (id && rating) {
    res.locals.db.prepare('UPDATE Tracks SET rating=? WHERE id=?').run(rating, id);
    res.send(new structures.StatusResult("Updated track"));
  } else {
    res.send(new structures.StatusResult("Updated track"));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /annotation/add_play
 * @produces application/json 
 * @consumes application/json 
 * @group annotate - Annotation API
 * @param {string} id.query.required A string which uniquely identifies the file (song) or folder (album/artist) to rate.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put('/add_play', function (req, res) {
  var id = req.query.id;
  if (id) {
    res.locals.db.prepare('UPDATE Tracks SET play_count = play_count + 1 WHERE id=?').run(id);
    res.send(new structures.StatusResult("Updated track"));
  } else {
    res.send(new structures.StatusResult("Id is required"));
  }
});

module.exports = router;
