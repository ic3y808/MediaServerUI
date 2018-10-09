var path = require("path");
var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(path.join(process.env.DATA_DIR, "database.db"));

db.serialize(function () {
	var sql = "CREATE TABLE IF NOT EXISTS `subsonic_settings` (" +
		"`name` TEXT UNIQUE," +
		"`subsonic_address` TEXT," +
		"`subsonic_port` INTEGER," +
		"`subsonic_use_ssl` TEXT," +
		"`subsonic_include_port_in_url` TEXT," +
		"`subsonic_username` TEXT," +
		"`subsonic_password` TEXT" +
		");"
	db.run(sql);
});

module.exports.loadSettings = function (callback) {
	db.all("SELECT * FROM subsonic_settings", function (err, row) {
		if (err) console.log(err);
		callback(row);
	});
};

module.exports.saveSettings = function (settings, callback) {
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