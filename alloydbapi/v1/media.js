var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
const sharp = require("sharp");
var convert = require("../../common/convert");
var structures = require("../../common/structures");
var { ipcRenderer } = require("electron");

function sendFile(res, req, fileToSend, content_type) {
  const stat = fs.statSync(fileToSend);
  const total = stat.size;
  if (req.headers.range) {
    if (fs.existsSync(fileToSend)) {
      const range = req.headers.range;
      const parts = range.replace(/bytes=/u, "").split("-");
      const partialStart = parts[0];
      const partialEnd = parts[1];

      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
      const chunksize = (end - start) + 1;
      const rstream = fs.createReadStream(fileToSend, {
        start,
        end
      });
      try {
        //res.locals.db.prepare("UPDATE Stats SET tracks_served = tracks_served + 1, data_sent = data_sent + ?").run(req.hostname === "localhost" ? 0 : total);
        res.locals.db.prepare("UPDATE Stats SET tracks_served = tracks_served + 1, data_sent = data_sent + ?").run(total);
      } catch (err) {
        res.locals.error("api/media/sendFile");
        res.locals.error(err);
      }

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": content_type
      });
      rstream.pipe(res);

    } else {
      res.locals.error("api/media/sendFile Error - 404");
      res.send("Error - 404");
      res.end();
    }

  } else {
    // res.locals.db.prepare("UPDATE Stats SET tracks_served = tracks_served + 1, data_sent = data_sent + ?").run(req.hostname === "localhost" ? 0 : total);
    res.locals.db.prepare("UPDATE Stats SET tracks_served = tracks_served + 1, data_sent = data_sent + ?").run(total);
    res.writeHead(200, {
      "Content-Length": total,
      "Content-Type": content_type
    });
    var rstream = fs.createReadStream(fileToSend);
    rstream.pipe(res);
  }
  if (ipcRenderer) { ipcRenderer.send("system-get-stats"); }
}

/**
 * This function comment is parsed by doctrine
 * @route GET /media/stream
 * @produces application/json 
 * @consumes application/json 
 * @group media - Media API
 * @param {string} id.query.required ID of the song
 * @param {string} bitrate.query If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.
 * @param {string} format.query Specifies the preferred target format
 * @param {string} estimateContentLength.query If set to "true", the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.
 * @returns {BinaryType} 200 - Returns binary data on success
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/stream", function (req, res) {
  var id = req.query.id;
  var bitrate = req.query.bitrate;
  var format = req.query.format;
  var estimateContentLength = req.query.estimateContentLength;
  var track = res.locals.db.prepare("SELECT * FROM Tracks WHERE id=?").get(id);
  var settingsResult = res.locals.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
  if (settingsResult && settingsResult.settings_value) {
    var settings = JSON.parse(settingsResult.settings_value);
    if (settings) {
      if (track) {
        if (format === "Unchanged") {
          sendFile(res, req, track.path, track.content_type);
        } else {
          if (track.converted_path && fs.existsSync(track.converted_path)) {
            sendFile(res, req, track.converted_path, track.converted_content_type);
          } else {
            var baseDir = process.env.CONVERTED_MEDIA_DIR;
            if (settings.alloydb_streaming_cache_starred === true && track.starred === "true") { baseDir = process.env.CONVERTED_STARRED_MEDIA_DIR; }
            var outputPath = path.join(baseDir, path.basename(track.path, path.extname(track.path)) + "." + format.toLowerCase());
            convert(res.locals.db, track, bitrate, format, outputPath,
               () => {
              res.locals.debug("Starting conversion of track: " + track.path);
            }, (progress) => {
              res.locals.debug("Processing: " + progress.timemark + " done " + progress.targetSize + " kilobytes");
            }, (err) => {
              res.locals.error(err);
            }, (returnPath) => {
              res.locals.debug("Finished Conversion - " + returnPath);
              sendFile(res, req, outputPath, track.content_type);
            });
          }
        }
      }
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
router.get("/download", function (req, res) {
  var id = req.query.id;

  var track = res.locals.db.prepare("SELECT * FROM Tracks WHERE id=?").get(id);
  if (track.length !== 0) {
    res.setHeader("Content-disposition", "attachment; filename=" + path.basename(track.path));
    res.setHeader("Content-Type", "application/" + track.content_type);
    var rstream = fs.createReadStream(track.path);
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
 * @param {string} width.query If specified, scale image width to this size.
 * @param {string} height.query If specified, scale image height to this size.
 * @param {string} quality.query If specified, changes the images quality, default 30%
 * @param {string} original.query If specified, return the original image. 
 * @returns {BinaryType} 200 - Returns the cover art image in binary form.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/cover_art", function (req, res) {
  var artist_id = req.query.artist_id;
  var track_id = req.query.track_id;
  var album_id = req.query.album_id;
  var original = req.query.original;
  var quality = req.query.quality === undefined ? 30 : req.query.quality;
  var coverFile = "";

  var shuffle = (a) => {
    for (var i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  if (artist_id) {
    var artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(artist_id);
    if (artist && artist.path) {
      //if (fs.existsSync(path.join(artist.path, process.env.LOGO_IMAGE))) {
      //  coverFile = path.join(artist.path, process.env.LOGO_IMAGE);
      //}
      if (!coverFile) {
        var artistAlbums = res.locals.db.prepare("SELECT * FROM Albums WHERE artist_id=?").all(artist_id);
        artistAlbums = shuffle(artistAlbums);
        artistAlbums.forEach((album) => {
          if (!coverFile) {
            if (fs.existsSync(path.join(album.path, process.env.COVERART_IMAGE))) {
              coverFile = path.join(album.path, process.env.COVERART_IMAGE);
            } else {
              var albumTracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
              albumTracks = shuffle(albumTracks);
              albumTracks.forEach((albumTrack) => {
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
    var track = res.locals.db.prepare("SELECT * FROM Tracks WHERE id=?").get(track_id);
    if (track) {
      if (fs.existsSync(path.join(process.env.COVER_ART_DIR, track.id + ".jpg"))) {
        coverFile = path.join(process.env.COVER_ART_DIR, track.id + ".jpg");
      }
      if (!coverFile) {
        var albumTracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(track.album_id);
        albumTracks = shuffle(albumTracks);
        albumTracks.forEach((albumTrack) => {
          if (!coverFile) {
            if (fs.existsSync(path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg"))) {
              coverFile = path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg");
            }
          }
        });
      }
    }

  } else if (album_id) {
    var albumTracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album_id);
    albumTracks = shuffle(albumTracks);
    albumTracks.forEach((albumTrack) => {
      if (!coverFile) {
        if (fs.existsSync(path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg"))) {
          coverFile = path.join(process.env.COVER_ART_DIR, albumTrack.cover_art + ".jpg");
        }
      }
    });
  }

  var input = process.env.COVER_ART_NO_ART;
  if (coverFile && fs.existsSync(coverFile)) {
    const stats = fs.statSync(coverFile);
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes > 15000) {
      input = coverFile;
    }
  }

  if (!original) {
    var img = sharp(input).jpeg({ quality: quality });
    var width = req.query.width;
    var height = req.query.height;
    if (width && height) {
      img = img.resize({
        width: width, height: height, fit: sharp.fit.cover, position: sharp.strategy.entropy
      });
    }
    img.toBuffer().then((data) => {
      res.end(data);
    })
      .catch((err) => {
        res.locals.error("api/media/cover_art");
        res.locals.error(err);
        res.send(err);
      });
  } else {
    res.sendFile(input);
  }
});

module.exports = router;
module.exports.db = {};