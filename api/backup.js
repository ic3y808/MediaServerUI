"use strict";
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const logger = require("../common/logger");

class Backup {
  constructor(database) {
    this.db = database;
  }

  doBackup() {
    logger.info("alloydb", "Starting backup");
    if (!fs.existsSync(process.env.BACKUP_DATA_DIR)) { shell.mkdir("-p", process.env.BACKUP_DATA_DIR); }

    return this.db.backup(path.join(process.env.BACKUP_DATA_DIR, `backup-${Date.now()}.db`));
  }
}

module.exports = Backup;