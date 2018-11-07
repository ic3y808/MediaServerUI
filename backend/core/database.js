var path = require("path");
var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(path.join(process.env.DATA_DIR, "database.db"));

db.serialize(function () {
	var subsonicSettings = "CREATE TABLE IF NOT EXISTS `subsonic_settings` (" +
		"`name` TEXT UNIQUE," +
		"`subsonic_address` TEXT," +
		"`subsonic_port` INTEGER," +
		"`subsonic_use_ssl` TEXT," +
		"`subsonic_include_port_in_url` TEXT," +
		"`subsonic_username` TEXT," +
		"`subsonic_password` TEXT" +
		");";
	db.run(subsonicSettings);
	var sabnzbdSettings = "CREATE TABLE IF NOT EXISTS `sabnzbd_settings` (" +
		"`name` TEXT UNIQUE," +
		"`sabnzbd_url_base` TEXT," +
		"`sabnzbd_host` TEXT," +
		"`sabnzbd_port` INTEGER," +
		"`sabnzbd_apikey` TEXT," +
		"`sabnzbd_use_ssl` TEXT," +
		"`sabnzbd_include_port_in_url` TEXT," +
		"`sabnzbd_username` TEXT," +
		"`sabnzbd_password` TEXT" +
		");";
	db.run(sabnzbdSettings);
});

module.exports.loadSubsonicSettings = function (callback) {
	db.all("SELECT * FROM subsonic_settings", function (err, row) {
		if (err) console.log(err);
		callback(row);
	});
};

module.exports.saveSubsonicSettings = function (settings, callback) {
	try {
		var stmt = db.prepare("INSERT OR REPLACE INTO subsonic_settings VALUES (?,?,?,?,?,?,?)");
		stmt.run("general", settings.subsonic_address, settings.subsonic_port, settings.subsonic_use_ssl, settings.subsonic_include_port_in_url, settings.subsonic_username, settings.subsonic_password);
		stmt.finalize();
	} catch (error) {
		if (error) {
			console.log(error);
			console.log(sql);
		}
	}
	callback();
};

module.exports.loadSabnzbdSettings = function (callback) {
	db.all("SELECT * FROM sabnzbd_settings", function (err, row) {
		if (err) console.log(err);
		callback(row);
	});
};

module.exports.saveSabnzbdSettings = function (settings, callback) {
	try {
		var stmt = db.prepare("INSERT OR REPLACE INTO sabnzbd_settings VALUES (?,?,?,?,?,?,?,?,?)");
		stmt.run("general", settings.sabnzbd_url_base, settings.sabnzbd_host, settings.sabnzbd_port, settings.sabnzbd_apikey, settings.sabnzbd_use_ssl, settings.sabnzbd_include_port_in_url, settings.sabnzbd_username, settings.sabnzbd_password);
		stmt.finalize();
	} catch (error) {
		if (error) {
			console.log(error);
			console.log(sql);
		}
	}
	callback();
};