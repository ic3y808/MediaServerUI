const Musicbrainz = require("./plugin");
var log = require("../../../../common/logger");
var db = require("../../database");
var brainz = null;
var timer = {};
module.exports.io = {};

module.exports.socketConnect = function (socket) {
  log.debug("alloyui", "musicbrainz plugin socketConnect");


};

log.info("alloyui", "musicbrainz plugin loaded");