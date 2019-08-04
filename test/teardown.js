const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const util = require("./testFuncs");
const dataDir = path.join(__dirname, "..", "test_data");
global.after(function (done) {
  if (this.app && this.app.isRunning()) {
    util.activateWindow(this.app, "Alloy").then(() => {
      this.app.client.webContents.send("test-quit");
      setTimeout(() => {
        this.db.setState({});
        if (fs.existsSync(dataDir)) { shell.rm("-r", dataDir); }
        done();
      }, 500);
    });
  }
});