const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const electronPath = require("electron");
const Application = require("spectron").Application;
const testDataDir = path.join(__dirname, "..", "test_data");
const adapter = new FileSync(path.join(testDataDir, "db.json"));

global.before(function () {
  this.apiTestPort = 9000;
  this.apiUiTestPort = 9090;
  this.app = new Application({
    chromeDriverArgs: ["--disable-extensions"],
    path: electronPath,
    args: [
      "--require",
      path.join(__dirname, "..", "common", "preload.js"),
      path.join(__dirname, "..", "alloy", "main.js")
    ],
    env: {
      SPECTRON: true,
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true,
      API_ENABLED: "true",
      UI_ENABLED: "true",
      API_PORT_TEST: this.apiTestPort,
      API_UI_PORT_TEST: this.apiUiTestPort,
      MODE: "test",
      NODE_ENV: "test"
    },
  });
  return this.app.start();
});

global.beforeEach(function () {
  this.db = low(adapter);
});

global.afterEach(async function () {
  if (this.app && this.app.isRunning()) {
    var logs = await this.app.client.getMainProcessLogs();
    logs.forEach(function (log) {
      console.log(log);
    });
  }
});