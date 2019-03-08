'use strict';
var express = require('express');
var router = express.Router();
var structures = require('./structures');
var path = require('path');
var utils = require('./utils');
var logger = require('../../../common/logger');

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artists_index
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<MusicFolder>}  Returns an array of MusicFolder objects
 * @returns {MusicFolder} 200 - Returns all configured top level music folders. Takes no extra parameters
 * @security ApiKeyAuth
 */
router.get('/artists_index', function (req, res) {
  var artists = res.locals.db.prepare('SELECT DISTINCT * FROM Artists ORDER BY name COLLATE NOCASE ASC').all();
  var finalResult = utils.createIndex(artists);
  var result = {
    index: finalResult
  };

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artists
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<Artist>} 200 - Returns an array of Artist objects
 * @security ApiKeyAuth
 */
router.get('/artists', function (req, res) {
  var artists = res.locals.db.prepare('SELECT * FROM Artists ORDER BY name ASC').all();
  res.json({
    artists: artists
  });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artist
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Artist} 200 - Returns an artist
 * @security ApiKeyAuth
 */
router.get('/artist', function (req, res) {
  var id = req.query.id;
  var all_albums = res.locals.db.prepare('SELECT * FROM Albums WHERE artist_id=?').all(id);
  var result = {
    artist: res.locals.db.prepare('SELECT * FROM Artists WHERE id=?').get(id),
    tracks: res.locals.db.prepare('SELECT * FROM Tracks WHERE artist_id=? ORDER BY album ASC, no ASC, of ASC').all(id),
    popular_tracks: res.locals.db.prepare('SELECT * FROM Tracks WHERE artist_id=? ORDER BY play_count DESC LIMIT 5').all(id),
    links: res.locals.db.prepare('SELECT * FROM Links WHERE artist_id=?').all(id),
    albums: [],
    EPs: [],
    singles: [],
  };

  all_albums.forEach(album => {
    album.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=? ORDER BY album ASC, no ASC, of ASC').all(album.id)
    switch (album.type) {
      case "EP":
        result.EPs.push(album);
        break;
      case "Album":
        result.albums.push(album);
        break;
      case "Single":
        result.singles.push(album);
        break;
    }
  });

  //result.prev = res.locals.db.prepare('SELECT id, name FROM Artists WHERE sort_order=?').get(result.artist.sort_order - 1);
  //result.next = res.locals.db.prepare('SELECT id, name FROM Artists WHERE sort_order=?').get(result.artist.sort_order + 1);

  var totalSize = 0;
  result.tracks.forEach(track => {
    totalSize += track.size;
  });

  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/albums
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
router.get('/albums', function (req, res) {
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
 * @route GET /browse/album
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Album} 200 - Returns an album
 * @security ApiKeyAuth
 */
router.get('/album', function (req, res) {
  var id = req.query.id;
  var result = {
    album: res.locals.db.prepare('SELECT * FROM Albums WHERE id=?').get(id),
    tracks: res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=? ORDER BY album ASC, no ASC, of ASC').all(id),
  }
  if (result.album && result.album.artist_id) {
    result.artist = res.locals.db.prepare('SELECT * FROM Artists WHERE id=?').get(result.album.artist_id);
  }

  var totalSize = 0;
  result.tracks.forEach(track => {
    totalSize += track.size;
  });
  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/genres
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<Genre>}  Returns an array of Genre objects
 * @security ApiKeyAuth
 */
router.get('/genres', function (req, res) {

  var result = {};
  result.genres = res.locals.db.prepare('SELECT * FROM Genres ORDER BY track_count DESC').all();
  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/genre
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Genre} 200 - Returns a genre
 * @security ApiKeyAuth
 */
router.get('/genre', function (req, res) {
  var id = req.query.id;
  var result = {};
  result.genre = res.locals.db.prepare('SELECT * FROM Genres WHERE id=?').get(id)
  result.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE genre=? ORDER BY artist ASC, album ASC, no ASC, of ASC').all(id)

  var totalSize = 0;
  result.tracks.forEach(track => {
    totalSize += track.size;
  });

  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/charts
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {int} limit.query Max number of songs to return.
 * @security ApiKeyAuth
 */
router.get('/charts', function (req, res) {
  var limit = req.query.limit ? req.query.limit : 15;
  var result = {
    charts: {}
  };

  var allAlbums = res.locals.db.prepare("SELECT * FROM Albums ORDER BY RANDOM() LIMIT 50").all();
  result.charts.never_played_albums = [];
  allAlbums.forEach(album => {
    if (result.charts.never_played_albums.length >= limit) return;
    var allTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    if (allTracks.length > 0) {
      var anyPlays = allTracks.every(obj => {
        obj.play_count === 0;
      });
      if (anyPlays === false) {
        result.charts.never_played_albums.tracks = allTracks;
        result.charts.never_played_albums.push(album);
      }
    }
  });

  result.charts.top_tracks = res.locals.db.prepare("SELECT * FROM Tracks ORDER BY play_count DESC LIMIT ?").all(limit);
  result.charts.never_played = res.locals.db.prepare("SELECT * FROM Tracks WHERE play_count=0 ORDER BY RANDOM() LIMIT ?").all(limit);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/fresh
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} limit.query
 * @returns {Object} 200 - Returns the newest additions to the library
 * @security ApiKeyAuth
 */
router.get('/fresh', function (req, res) {
  var limit = req.query.limit === undefined ? 10 : req.query.limit;
  var result = {
    fresh: {
      albums: [],
      artists: [],
      tracks: []
    }
  };
  //var tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE CAST((last_modified/1000) AS LONG) >= strftime('%s', 'now', '-" + days_back + " day');").all()
  var albumIds = res.locals.db.prepare("SELECT DISTINCT album_id FROM Tracks ORDER BY last_modified DESC, album ASC, no ASC, of ASC LIMIT ?").all(limit)
  var artistsIds = res.locals.db.prepare("SELECT DISTINCT artist_id FROM Tracks ORDER BY last_modified DESC, album ASC, no ASC, of ASC LIMIT ?").all(limit)
  result.fresh.tracks = res.locals.db.prepare("SELECT * FROM Tracks ORDER BY last_modified DESC, album ASC, no ASC, of ASC LIMIT ?").all(limit)

  artistsIds.forEach(id => {
    var artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(id.artist_id);
    artist.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=?").all(artist.id);
    result.fresh.artists.push(artist);
  });
  albumIds.forEach(id => {
    var album = res.locals.db.prepare("SELECT * FROM Albums WHERE id=?").get(id.album_id);
    album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
    result.fresh.albums.push(album);
  });
  res.json(result);
});

module.exports = router;