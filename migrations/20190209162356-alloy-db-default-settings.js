exports.setup = function (options, seedLink) {

};

exports.up = function (db) {
  return {
    sql: true,
    command: "INSERT OR REPLACE INTO `Settings`(`settings_key`,`settings_value`) VALUES (?,?);",
    values: ["alloydb_settings", "{\"alloydb_host\":\"localhost\",\"alloydb_port\":4000,\"alloydb_apikey\":\"" + process.env.API_KEY + "\",\"alloydb_include_port_in_url\":true,\"alloydb_lastfm_username\":\"\",\"alloydb_lastfm_password\":\"\",\"alloydb_scrobble\":false,\"alloydb_love_tracks\":false}"]
  }
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
