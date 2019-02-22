var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var logger = require('../../../common/logger');

class MediaScannerBase {

  constructor(database) {
    this.db = database;
    this.resetStatus();
  }

  shouldCancel() {
    if (this.scanStatus.shouldCancel) {
      this.updateStatus("Scanning Cacelled", false);
      return true;
    }
    return false;
  };

  cancelScan() {
    if (this.isScanning()) {
      this.scanStatus.shouldCancel = true;
      this.updateStatus('Starting cancel', false);
      logger.info("alloydb", 'Starting cancel scan');
    } else {
      this.updateStatus("Cancelled scanning", false);
      logger.info("alloydb", 'Cancelled scanning');
    }
  };

  resetStatus() {
    this.scanStatus = {
      status: '',
      isScanning: false,
      shouldCancel: false
    };
  };

  updateStatus(status, isScanning) {
    this.scanStatus.status = status;
    this.scanStatus.isScanning = isScanning;
    logger.info("alloydb", JSON.stringify(this.scanStatus));
  };

  getStatus() {
    return this.scanStatus;
  }

  isScanning() {
    return this.scanStatus.isScanning;
  };

  downloadPage(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
      return JSON.parse(request.responseText);
    } else return null;
  }

  checkSortOrder() {
    logger.info("alloydb", 'checking table sort orders');
    this.updateStatus('checking base sort order', true);
    var allArtists = this.db.prepare('SELECT * FROM Artists ORDER BY name COLLATE NOCASE ASC').all();
    for (var i = 0; i < allArtists.length; ++i) {
      this.db.prepare("UPDATE Artists SET sort_order=? WHERE id=?").run(i, allArtists[i].id);
    }
  };

  cleanup() {
    logger.info("alloydb", 'cleanup complete');
    this.checkSortOrder();
    this.updateStatus('Scan Complete', false);
  }

  incrementalCleanup() {
    if (this.isScanning()) {
      logger.debug("alloydb", 'scan in progress');
    } else {
      logger.info("alloydb", 'incrementalCleanup');
      this.cleanup();
    }
  }

  writeDb(data, table) {
    var sql = 'INSERT OR REPLACE INTO ' + table + ' (';
    var values = {};
    Object.keys(data).forEach(function (key, index) {
      if (index == Object.keys(data).length - 1)
        sql += key;
      else
        sql += key + ', ';
    });



    sql += ') VALUES (';


    Object.keys(data).forEach(function (key, index) {
      if (index == Object.keys(data).length - 1)
        sql += '@' + key;
      else
        sql += '@' + key + ', ';
    });

    sql += ')';

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
}

module.exports = MediaScannerBase;