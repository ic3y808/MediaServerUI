import Musicbrainz from "./plugin";
import { debug, info } from "../../../../../common/logger";
import db from "../../database";
var brainz = null;
var timer = {};
export const io = {};

export function socketConnect (socket) {
  debug("alloyui", "musicbrainz plugin socketConnect");
}

info("alloyui", "musicbrainz plugin loaded");