const path = require("path");
module.exports = function migrate(db, migrationDir) {
  db.prepare("CREATE TABLE IF NOT EXISTS Migrations (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR (255) NOT NULL, `run_on` datetime NOT NULL)").run();
  var fs = require('fs');
  var files = fs.readdirSync(migrationDir);
  files.forEach((file) => {
    var existingInDb = db.prepare("SELECT * FROM Migrations WHERE name=?").get(file);
    if (!existingInDb) {
      var req = require(path.join(migrationDir, file));
      var data = req.up(db);
      if (data.sql === true) {

        try {
          db.prepare(data.command).run(data.values);
        } catch (err) {
          if (err) { console.log( JSON.stringify(err)); }
          console.log( data.command);
          console.log( data.values);
        }
      } else {
        var sql = "CREATE TABLE ";
        if (data.ifNotExists) sql += "IF NOT EXISTS ";
        sql += data.name + " (";

        var values = {};

        function getType(key) {
          switch (key) {
            case "int": return "INTEGER";
            case "string": return "TEXT NOT NULL";
          }
        }


        Object.keys(data.columns).forEach((key, index) => {
          if (index === Object.keys(data.columns).length - 1) { sql += key; }
          else {
            sql += key;
            sql += " ";
            sql += getType(data.columns[key].type);
            if (data.columns[key].primaryKey === true) sql += " PRIMARY KEY";
            if (data.columns[key].unique === true) sql += " UNIQUE";
            if (data.columns[key].autoIncrement === true) sql += " AUTOINCREMENT";
            if (data.columns[key].defaultValue) sql += " DEFAULT `" + data.columns[key].defaultValue + "`";
            sql += ", ";
          }
        });

        sql += ")";

        try {
          var insert = db.prepare(sql);
          insert.run();
          db.prepare("INSERT INTO Migrations (name,run_on) VALUES (?,?);").run(file, new Date().toISOString());
        } catch (err) {
          if (err) { console.log( JSON.stringify(err)); }
          console.log( sql);
          console.log( values);
        }
      }
    }
  });
}


