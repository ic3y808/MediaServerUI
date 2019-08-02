const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules.
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
var dataDir = path.join(__dirname, "test_data");


describe("Application launch", function () {
  this.timeout(10000);

  before(function () {
    shell.rm("-r", dataDir);
    shell.mkdir("-p", dataDir);
    this.app = new Application({
      // Your electron path can be any binary
      // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
      // But for the sake of the example we fetch it from our node_modules.
      path: electronPath,
      args: [path.join(__dirname, "..", "main.js")],
      env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_ENABLE_STACK_DUMPING: true,
        MODE: "test",
        NODE_ENV: "test"
      },
    });
    return this.app.start();
  });

  after(async function () {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }
  });

  beforeEach(function () {


  });

  afterEach(function () {

  });

  it("shows an initial window", function () {
    return this.app.client.getWindowCount().then(function (count) {
      console.log("window count " + count);
      assert.equal(count, 1);
    });
  });

  it("go to log tab", function (done) {
    this.timeout(10000);
    console.log("clicking log tab");
    this.app.client.element("#logsNav").click().then(function () {
      setTimeout(function () {
        done();
      }, 3000);
    });
  });
});