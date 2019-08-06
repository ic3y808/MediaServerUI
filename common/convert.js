var fs = require("fs");
const mime = require("mime-types");
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
var logger = require("./logger");
var loggerTag = "convert";

module.exports = function convert(db, track, bitrate, format, output, cb) {
  logger.info(loggerTag, "Starting Conversion");
  var audioCodec = "libmp3lame";
  var command = ffmpeg(track.path)
    .noVideo()
    .audioCodec(audioCodec)
    .audioBitrate(bitrate)
    .output(output)
    .on("progress", function (progress) {
      logger.debug(loggerTag, "Processing: " + progress.timemark + " done " + progress.targetSize + " kilobytes");
    })
    .on("error", function (err, stdout, stderr) {
      logger.error(loggerTag, "Cannot process video");
      logger.error(loggerTag, err);
    })
    .on("end", () => {
      track.converted_path = output;
      var stats = fs.statSync(track.converted_path);
      track.converted_content_type = mime.lookup(track.converted_path);
      track.converted_size = stats.size;
      logger.info(loggerTag, "Conversion successful");
      db.prepare("UPDATE Tracks SET converted_path = ?, converted_content_type = ?, converted_size = ? WHERE id=?").run(track.converted_path, track.converted_content_type, track.converted_size, track.id);
      cb(track.converted_path);
    }).run();
    logger.debug(loggerTag, "Executing Command: " + command);
};