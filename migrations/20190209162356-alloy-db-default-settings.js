exports.setup = function (options, seedLink) {

};

var defaults = {
  alloydb_host: "localhost",
  alloydb_port: process.env.API_PORT,
  alloydb_apikey: process.env.API_KEY,
  alloydb_include_port_in_url: true,
  alloydb_lastfm_username: "",
  alloydb_lastfm_password: "",
  alloydb_scrobble: false,
  alloydb_love_tracks: false,
  alloydb_streaming_format: "Unchanged",
  alloydb_streaming_bitrate: "128",
  alloydb_streaming_cache_strat: "memory",
  alloydb_streaming_cache_strat_days: "10",
  alloydb_streaming_cache_strat_tracks: "100",
  alloydb_streaming_cache_strat_memory: "5gb",
  alloydb_streaming_cache_starred: true
};

exports.up = function (db) {
  return {
    sql: true,
    command: "INSERT OR IGNORE INTO `Settings`(`settings_key`,`settings_value`) VALUES (?,?);",
    values: ["alloydb_settings", JSON.stringify(defaults)]
  };
};

exports.down = function (db) {
  return null;
};

exports.testData = function () {
  return null;
};

exports.test = function () {
  return null;
};

exports._meta = {
  "version": 1
};
