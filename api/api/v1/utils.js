"use strict";
var path = require("path");
var logger = require("../../../common/logger");
var supportedExtensions = [".mp3", ".wav", ".flac", ".ogg", ".aiff", ".aac"];

module.exports.toHumanReadable = function toHumanReadable(val) {
  var thresh = 1000;
  if (Math.abs(val) < thresh) {
    val = val + " B";
  } else {
    var units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var u = -1;
    do {
      val /= thresh;
      ++u;
    } while (Math.abs(val) >= thresh && u < units.length - 1);
    val = val.toFixed(1) + " " + units[u];
  }
  return val;
}

module.exports.isFileValid = function isFileValid(file) {
  var isValid = false;
  supportedExtensions.forEach(function (ext) {
    if (path.extname(file).toLowerCase() === ext.toLowerCase()) isValid = true;
  });
  return isValid;
};

module.exports.isStringValid = function isStringValid(str, defaultStr) {
  if (str === undefined) {
    return defaultStr;
  } else if (typeof str === "string") {
    if (str === null || str === undefined || str === "") return defaultStr;
    return str;
  } else if (Object.prototype.toString.call(str) === "[object Array]") {
    if (str.length === 0) return defaultStr;
    if (str[0] === null || str[0] === undefined || str[0] === "") return defaultStr;
    return str[0];
  } else if (Object.prototype.toString.call(str) === "[object Object]") {
    if (str.toString() === "[object Object]") return defaultStr;
    else return str.toString();
  }
  return str;
}

module.exports.compare = function compare(a, b) {
  if (a.size > b.size)
    return -1;
  if (a.size < b.size)
    return 1;
  return 0;
};

module.exports.testForLetter = function (character) {
  try {
    //Variable declarations can"t start with digits or operators
    //If no error is thrown check for dollar or underscore. Those are the only nonletter characters that are allowed as identifiers
    eval("let " + character + ";");
    let regExSpecial = /[^\$_]/;
    return regExSpecial.test(character);
  } catch (error) {
    return false;
  }
}

module.exports.createIndex = function createIndex(items) {
 var result = {};
  items.forEach(function (item) {
    var indexName = item.name.slice(0, 1).toUpperCase();
    if (module.exports.testForLetter(indexName)) {
      if (!result[indexName]) result[indexName] = [];
      result[indexName].push(item);
    } else {
      if (!result["#"]) result["#"] = [];
      result["#"].push(item);
    }
  });
  var finalResult = [];
  for (var key in result) {
      finalResult.push({
        name: key,
        value: result[key]
      });
  }
  return finalResult;
};

module.exports.writeDb = function(data, table) {
  var sql = "INSERT OR REPLACE INTO " + table + " (";
  var values = {};
  Object.keys(data).forEach(function (key, index) {
    if (index == Object.keys(data).length - 1)
      sql += key;
    else
      sql += key + ", ";
  });



  sql += ") VALUES (";


  Object.keys(data).forEach(function (key, index) {
    if (index == Object.keys(data).length - 1)
      sql += "@" + key;
    else
      sql += "@" + key + ", ";
  });

  sql += ")";

  try {
    var insert = this.db.prepare(sql);


    Object.keys(data).forEach(function (key, index) {
      var a = {};
      a[key] = data[key];
      Object.assign(values, a);
    });

    insert.run(values);
  } catch (err) {
    if (err) logger.error("alloydb", JSON.stringify(err));
    logger.info("alloydb", sql);
    logger.info("alloydb", values);
  }

};