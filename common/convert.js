var fs = require("fs");
const mime = require("mime-types");
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);

module.exports = function convert(db, track, bitrate, format, output, startCb, updateCb, errCb, endCb) {
  var audioCodec = "libmp3lame";
  var command = ffmpeg(track.path)
    .noVideo()
    .audioCodec(audioCodec)
    .audioBitrate(bitrate)
    .output(output)
    .on("progress", function (progress) {
      updateCb(progress);
    })
    .on("error", function (err, stdout, stderr) {
      errCb(err);
    })
    .on("end", () => {
      track.converted_path = output;
      var stats = fs.statSync(track.converted_path);
      track.converted_content_type = mime.lookup(track.converted_path);
      track.converted_size = stats.size;
      db.prepare("UPDATE Tracks SET converted_path = ?, converted_content_type = ?, converted_size = ? WHERE id=?").run(track.converted_path, track.converted_content_type, track.converted_size, track.id);
      endCb(track.converted_path);
    });
  startCb();
  command.run();
};