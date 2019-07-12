var fs = require("fs");
const { ipcRenderer } = require("electron");
const mime = require("mime-types");

var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);

function error(data) { ipcRenderer.send("error", { source: "MediaConverter", data: data }); }
function debug(data) { ipcRenderer.send("debug", { source: "MediaConverter", data: data }); }
function info(data) { ipcRenderer.send("info", { source: "MediaConverter", data: data }); }


module.exports = function convert(db, track, bitrate, format, output, cb) {
  info("Starting Conversion");
  var audioCodec = "libmp3lame";
  var comand = ffmpeg(track.path)
    .noVideo()
    .audioCodec(audioCodec)
    .audioBitrate(bitrate)
    .output(output)
    .on("progress", function (progress) {
      debug("Processing: " + progress.timemark + " done " + progress.targetSize + " kilobytes");
    })
    .on("error", function (err, stdout, stderr) {
      console.log("Cannot process video: " + err.message);
      error("Error converting - " + err.message);
    })
    .on("end", () => {
      track.converted_path = output;
      var stats = fs.statSync(track.converted_path);
      track.converted_content_type = mime.lookup(track.converted_path);
      track.converted_size = stats.size;
      info("Conversion successful");
      db.prepare("UPDATE Tracks SET converted_path = ?, converted_content_type = ?, converted_size = ? WHERE id=?").run(track.converted_path, track.converted_content_type, track.converted_size, track.id);
      cb(track.converted_path);
    }
    ).run();
};