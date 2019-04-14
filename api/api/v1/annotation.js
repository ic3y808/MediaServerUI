"use strict";

var express = require("express");
var router = express.Router();
var structures = require("./structures");
var moment = require("moment");

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
router.put("/star", (req, res) => {
  var id = req.query.id;
  var album = req.query.album;
  var artist = req.query.artist;
  var genre = req.query.genre;

  var time = moment().unix();
  if (id) {
    res.locals.db.prepare("UPDATE Tracks SET starred='true', starred_date=? WHERE id=?").run(time, id);
    res.send(new structures.StatusResult("Updated track"));
  }
  if (album) {
    res.locals.db.prepare("UPDATE Albums SET starred='true', starred_date=? WHERE id=?").run(time, album);
    res.send(new structures.StatusResult("Updated album"));
  }
  if (artist) {
    res.locals.db.prepare("UPDATE Artists SET starred='true', starred_date=? WHERE id=?").run(time, artist);
    res.send(new structures.StatusResult("Updated artist"));
  }
  if (genre) {
    res.locals.db.prepare("UPDATE Genres SET starred='true', starred_date=? WHERE genre_id=?").run(time, genre);
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
router.put("/unstar", (req, res) => {
  var id = req.query.id;
  var album = req.query.album;
  var artist = req.query.artist;
  var genre = req.query.genre;

  if (id) {
    res.locals.db.prepare("UPDATE Tracks SET starred='false', starred_date='' WHERE id=?").run(id);
    res.send(new structures.StatusResult("Updated track"));
  }
  if (album) {
    res.locals.db.prepare("UPDATE Albums SET starred='false', starred_date='' WHERE id=?").run(album);
    res.send(new structures.StatusResult("Updated album"));
  }
  if (artist) {
    res.locals.db.prepare("UPDATE Artists SET starred='false', starred_date='' WHERE id=?").run(artist);
    res.send(new structures.StatusResult("Updated artist"));
  }
  if (genre) {
    res.locals.db.prepare("UPDATE Genres SET starred='false', starred_date='' WHERE genre_id=?").run(genre);
    res.send(new structures.StatusResult("Updated genre"));
  }
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /annotation/set_rating
 * @produces application/json
 * @consumes application/json
 * @group annotate - Annotation API
 * @param {string} artist_id.query A string which uniquely identifies the file (artist) to rate.
 * @param {string} track_id.query A string which uniquely identifies the file (song) to rate.
 * @param {string} album_id.query A string which uniquely identifies the file (album) to rate.
 * @param {string} rating.query.required The rating between 1 and 5 (inclusive), or 0 to remove the rating.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put("/set_rating", (req, res) => {
  var artist_id = req.query.artist_id;
  var track_id = req.query.track_id;
  var album_id = req.query.album_id;
  var rating = req.query.rating;
  var status = null;
  if (artist_id) {
    res.locals.db.prepare("UPDATE Artists SET rating=? WHERE id=?").run(rating, artist_id);
    status = true;
  }
  if (track_id) {
    res.locals.db.prepare("UPDATE Tracks SET rating=? WHERE id=?").run(rating, track_id);
    status = true;
  }
  if (album_id) {
    res.locals.db.prepare("UPDATE Albums SET rating=? WHERE id=?").run(rating, album_id);
    status = true;
  }

  if (status === true) {
    res.send(new structures.StatusResult("Update success"));
  } else {
    res.send(new structures.StatusResult("Nothing updated"));
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
router.put("/add_play", (req, res) => {
  var id = req.query.id;
  if (id) {
    res.locals.db.prepare("UPDATE Tracks SET play_count = play_count + 1 WHERE id=?").run(id);
    res.send(new structures.StatusResult("Updated track"));
  } else {
    res.send(new structures.StatusResult("Id is required"));
  }
});

module.exports = router;
