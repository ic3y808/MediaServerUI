var uuidv3 = require("uuid/v3");
var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");
var externalIp = require("../../common/extip")();

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
router.get("/shares", function (req, res) {
  var shares = res.locals.db.prepare("SELECT * FROM Shares").all();
  res.json({ shares: shares });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /share/link
 * @produces application/json 
 * @consumes application/json 
 * @group share - Share API
 * @param {string} id.query.required ID of a share to lookup
 * @returns {Array.<Share>} 200 - Returns a link to a share based on the server UI host
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/link", function (req, res) {
  var id = req.query.id;
  var share = res.locals.db.prepare("SELECT * FROM Shares where id=?").get(id);
  externalIp((err, ip) => {
    if (err) {
      // every service in the list has failed
      throw err;
    }
    var shareId = share.id;
    if (share.url) { shareId = share.url; }
    res.json({ url: "http://" + ip + ":" + process.env.API_UI_PORT + "/share/" + shareId });
  });

});

/**
 * This function comment is parsed by doctrine
 * @route GET /share
 * @produces application/json 
 * @consumes application/json 
 * @group share - Share API
 * @param {string} id.query.required ID of a song, album, artist or genre to share. Use one id parameter for each entry to share.
 * @returns {Array.<Share>} 200 - Returns an array of shares
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/", function (req, res) {
  var id = req.query.id;
  var share = res.locals.db.prepare("SELECT * FROM Shares WHERE id=? OR url=?").get(id, id);
  var data = res.locals.db.prepare("SELECT * FROM SharesItems WHERE id=?").all(share.id);

  var result = {
    share: share,
    track: {},
    tracks: [],
    album: {},
    albums: [],
    artist: {},
    artists: [],
    genre: {},
    genres: []
  };

  switch (share.type) {
    case "track":
      data.forEach((shareItem) => {
        result.track = res.locals.db.prepare("SELECT * FROM Tracks WHERE id=?").get(shareItem.track_id);
        result.artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(result.track.artist_id);
        result.album = res.locals.db.prepare("SELECT * FROM Albums WHERE id=?").get(result.track.album_id);
      });
      break;
    case "album":
      data.forEach((shareItem) => {
        result.album = res.locals.db.prepare("SELECT * FROM Albums WHERE id=?").get(shareItem.album_id);
        result.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(result.album.id);
        result.artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(result.album.artist_id);
      });
      break;
    case "artist":
      data.forEach((shareItem) => {
        result.artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(shareItem.artist_id);
        result.albums = res.locals.db.prepare("SELECT * FROM Albums WHERE artist_id=?").all(result.artist.id);
        result.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=? ORDER BY album ASC, no ASC, of ASC").all(result.artist.id);
      });
      break;
    case "genre":
      data.forEach((shareItem) => {
        result.genre = res.locals.db.prepare("SELECT * FROM Genres WHERE id=?").get(shareItem.genre_id);
        result.albums = res.locals.db.prepare("SELECT * FROM Albums WHERE genre_id=?").all(result.genre.id);
        result.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE genre_id=?").all(result.genre.id);
      });
      break;
  }

  res.locals.db.prepare("UPDATE Shares SET visit_count = visit_count + 1, last_visited = ? WHERE id=?").run(new Date().toISOString(), id);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /share/create
 * @produces application/json 
 * @consumes application/json 
 * @group share - Share API
 * @param {string} type.query.required type: a track, album, artist, genre
 * @param {string} id.query.required ID of a song, album, artist or genre to share. Use one id parameter for each entry to share.
 * @param {string} url.query A custom /ending for the url to make it easy to find
 * @param {string} description.query A user-defined description that will be displayed to people visiting the shared media.
 * @param {int} expires.query The time at which the share expires. Given as milliseconds since 1970.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put("/", function (req, res) {
  var type = req.query.type;
  var id = req.query.id;
  var url = req.query.url;
  var description = req.query.description;
  var expires = req.query.expires;
  var newId = uuidv3(id, process.env.UUID_BASE).split("-")[0];
  var created = new Date().toISOString();

  res.locals.db.prepare("INSERT INTO Shares (`id`, `url`, `type`, `description`, `created`, `expires`) VALUES (?, ?, ?, ?, ?, ?);").run(newId, url, type, description, created, expires);
  switch (type) {
    case "track":
      res.locals.db.prepare("INSERT INTO SharesItems (`id`, `track_id`) VALUES (?, ?);").run(newId, id);
      break;
    case "album":
      res.locals.db.prepare("INSERT INTO SharesItems (`id`, `album_id`) VALUES (?, ?);").run(newId, id);
      break;
    case "artist":
      res.locals.db.prepare("INSERT INTO SharesItems (`id`, `artist_id`) VALUES (?, ?);").run(newId, id);
      break;
    case "genre":
      res.locals.db.prepare("INSERT INTO SharesItems (`id`, `genre_id`) VALUES (?, ?);").run(newId, id);
      break;
  }
  res.send(new structures.StatusResult("Done"));
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
router.delete("/", function (req, res) {
  var id = req.query.id;
  var existingShare = res.locals.db.prepare("SELECT * from Shares WHERE id=?").get(id);

  if (existingShare) {
    var shareItems = res.locals.db.prepare("SELECT * from SharesItems WHERE id=?").all(existingShare.id);
    shareItems.forEach((item) => {
      res.locals.db.prepare("DELETE FROM SharesItems WHERE id=?").run(item.id);
    });
    res.locals.db.prepare("DELETE FROM Shares WHERE id=?").run(existingShare.id);
  }
  res.send(new structures.StatusResult("Done"));
});

module.exports = router;
module.exports.db = {};