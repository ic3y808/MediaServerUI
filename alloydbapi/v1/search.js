var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");

/**
 * This function comment is parsed by doctrine
 * @route GET /search
 * @produces application/json 
 * @consumes application/json 
 * @group search - Search API
 * @param {string} artist.query Artist to search for.
 * @param {string} album.query Album to searh for.
 * @param {string} title.query Song title to search for.
 * @param {string} genre.query Song genre to search for.
 * @param {string} any.query Searches all fields.
 * @param {string} count.query Maximum number of results to return.
 * @param {string} offset.query Search result offset. Used for paging.
 * @param {string} newerThan.query Only return matches that are newer than this year. 
 * @returns {SearchResults} 200 - Returns SearchResults
 * @security ApiKeyAuth
 */
router.get("/", function (req, res) {
  var artist = "";
  var album = "";
  var title = "";
  var genre = "";
  var any = "";
  var count = 10;
  var offset = 0;
  var newerThan = 0;

  if (req.query.artist) { artist = req.query.artist; }
  if (req.query.album) { album = req.query.album; }
  if (req.query.title) { title = req.query.title; }
  if (req.query.genre) { genre = req.query.genre; }
  if (req.query.any) { any = req.query.any; }
  if (req.query.count) { count = req.query.count; }
  if (req.query.offset) { offset = req.query.offset; }
  if (req.query.newerThan) { newerThan = req.query.newerThan; }

  if (any) {
    var result = { artists: [], albums: [], tracks: [], genres: [] };
    result.artists = res.locals.db.prepare("SELECT * FROM Artists WHERE instr(UPPER(name), ?) > 0 LIMIT ? OFFSET ?").all(any.toUpperCase(), count, offset);
    result.albums = res.locals.db.prepare("SELECT * FROM Albums WHERE instr(UPPER(name), ?) > 0 LIMIT ? OFFSET ?").all(any.toUpperCase(), count, offset);
    result.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE instr(UPPER(title), ?) > 0 OR instr(UPPER(artist), ?) > 0 OR instr(UPPER(album), ?) > 0 OR instr(UPPER(genre), ?) > 0 LIMIT ? OFFSET ?").all(any.toUpperCase(), any.toUpperCase(), any.toUpperCase(), any.toUpperCase(), count, offset);
    result.genres = res.locals.db.prepare("SELECT * FROM Genres WHERE instr(UPPER(name), ?) > 0 LIMIT ? OFFSET ?").all(any.toUpperCase(), count, offset);
    res.json(result);
  } else if (artist) {
    res.json(res.locals.db.prepare("SELECT * FROM Tracks WHERE instr(artist, ?  > 0 AND year >= ? LIMIT ? OFFSET ?").all(artist, newerThan, count, offset));
  } else if (album) {
    res.json(res.locals.db.prepare("SELECT * FROM Tracks WHERE instr(album, ?) > 0 AND year >= ? LIMIT ? OFFSET ?").all(album, newerThan, count, offset));
  } else if (title) {
    res.json(res.locals.db.prepare("SELECT * FROM Tracks WHERE instr(title, ?) > 0 AND year >= ? LIMIT ? OFFSET ?").all(title, newerThan, count, offset));
  } else if (genre) {
    res.json(res.locals.db.prepare("SELECT * FROM Tracks WHERE instr(genre, ?) > 0 AND year >= ? LIMIT ? OFFSET ?").all(genre, newerThan, count, offset));
  } else { res.send(new structures.StatusResult("Error no search term provided")); }
});


module.exports = router;
module.exports.db = {};