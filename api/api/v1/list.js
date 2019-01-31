'use strict';
var express = require('express');
var router = express.Router();

/**
 * This function comment is parsed by doctrine
 * @route GET /list/album_list
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @param {string} type.query.required The list type. Must be one of the following: random, newest, highest, frequent, recent. you can also use alphabeticalByName or alphabeticalByArtist to page through all albums alphabetically, and starred to retrieve starred albums. Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
 * @param {int} size.query The number of albums to return. Max 500, default 10
 * @param {int} offset.query The list offset. Useful if you for example want to page through the list of newest albums.
 * @param {string} genre.query.required The name of the genre, e.g., "Rock".
 * @returns {Array.<Album>} 200 - Returns an array of albums.
 * @security ApiKeyAuth
 */
router.get('/album_list', function (req, res) {
  var size = req.query.size;
  var offset = req.query.offset;
  var genre = req.query.genre;
  var size = 1000;
  if (req.query.size)
    size = req.query.size;
  var result = {};
  if (genre) {
    result.albums = res.locals.db.prepare('SELECT * FROM Albums WHERE genre=? COLLATE NOCASE ASC LIMIT ?').all(genre, size);
  } else {
    result.albums = res.locals.db.prepare('SELECT * FROM Albums ORDER BY artist ASC, name ASC LIMIT ?').all(size);
  }
  res.json(result)
});

/**
 * This function comment is parsed by doctrine
 * @route GET /list/random_songs
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @param {int} size.query The number of songs to return. Max 500, default 10
 * @param {int} fromYear.query Only return songs published after or in this year.
 * @param {int} toYear.query 	Only return songs published before or in this year.
 * @param {string} genre.query Only returns songs belonging to this genre.
 * @param {string} musicFolderId.query  Only return albums in the music folder with the given ID. See MusicFolders
 * @returns {Array.<Song>} 200 - Returns an array of random songs.
 * @security ApiKeyAuth
 */
router.get('/random_songs', function (req, res) {

  var fromYear = 0;
  var toYear = 999999;
  var genre = req.query.genre;
  var size = req.query.size;
  var musicFolderId = req.query.musicFolderId;

  if (req.query.fromYear)
    fromYear = req.query.fromYear;
  if (req.query.toYear)
    toYear = req.query.toYear;
  if (!size)
    size = 10;
  var random = {};
  if (genre) {
    random.random = res.locals.db.prepare('SELECT * FROM Tracks WHERE year >= ? AND year <= ? AND genre=? COLLATE NOCASE ORDER BY RANDOM() LIMIT ?').all(fromYear, toYear, genre, size);
  } else {
    random.random = res.locals.db.prepare('SELECT * FROM Tracks WHERE year >= ? AND year <= ? ORDER BY RANDOM() LIMIT ?').all(fromYear, toYear, size);
  }
  res.json(random)
});

/**
 * This function comment is parsed by doctrine
 * @route GET /list/songs_by_genre
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @param {string} id.query.required Only returns songs belonging to this genre.
 * @param {int} count.query The number of songs to return. Max 500, default 10
 * @param {int} offset.query The offset. Useful if you want to page through the songs in a genre.
 * @param {string} musicFolderId.query  Only return albums in the music folder with the given ID. See MusicFolders
 * @returns {Array.<Song>} 200 - Returns an array of songs in a genre.
 * @security ApiKeyAuth
 */
router.get('/songs_by_genre', function (req, res) {
  var id = req.query.id;
  var count = req.query.count;
  var offset = req.query.toYear;
  var musicFolderId = req.query.musicFolderId;
  var sql = 'SELECT * FROM Tracks WHERE genre_id=? LIMIT ? OFFSET ?';

  if (!count)
    count = 500;
  if (!offset)
    offset = 0;
  res.json(res.locals.db.prepare(sql).all(id, count, offset));
});

/**
 * This function comment is parsed by doctrine
 * @route GET /list/starred
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @returns {StarredMedia} 200 - Returns a collection of starred media.
 * @security ApiKeyAuth
 */
router.get('/starred', function (req, res) {
  var starredTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE starred=?').all('true')
  var starredAlbums = res.locals.db.prepare('SELECT * FROM Albums WHERE starred=?').all('true')
  var starredArtists = res.locals.db.prepare('SELECT * FROM Artists WHERE starred=?').all('true')
  res.json({ starred: { tracks: starredTracks, albums: starredAlbums, artists: starredArtists } });
});

module.exports = router;
