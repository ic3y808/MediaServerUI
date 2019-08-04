const chai = require("chai");
const assert = require("assert");
const util = require("./testFuncs");
const chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);

describe("Application launch", function () {
  this.timeout(10000);

  it("loaded the correct number of windows", async function () {
    var count = await this.app.client.getWindowCount();
    console.log("window count " + count);
    assert.equal(count, 4);
    await util.activateWindow(this.app, "Alloy");
    await this.app.client.element("#loadedState").getHTML(false).should.eventually.equal("true");
  });

  it("api server sent api-server-loaded-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("api-server-loaded-result").value().should.equal("success");
    }, 250);
  });

  it("scheduler sent scheduler-load-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("scheduler-load-result").value().should.equal("success");
    }, 250);
  });

  it("media scanner sent mediascanner-loaded-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("mediascanner-loaded-result").value().should.equal("success");
    }, 250);
  });

  it("renderer sent app-loaded-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("app-loaded-result").value().should.equal("success");
    }, 250);
  });

  it("main ui shows library count of 0", async function () {
    await this.app.client.element("#libraryCountRow").getHTML(false).should.eventually.equal("0");
  });

  it("can view uiServer tab", async function () {
    await util.click(this.app, "#uiServerNav");
  });

  it("can view scheduler tab", async function () {
    await util.click(this.app, "#scheduleNav");
  });

  it("can view mediascanner tab", async function () {
    await util.click(this.app, "#mediaScannerNav");
  });

  it("can view log tab", async function () {
    await util.click(this.app, "#logsNav");
  });

  it("can view database tab", async function () {
    await util.click(this.app, "#overviewNav");
  });

  it("can open webui window", async function () {
    await util.click(this.app, "#launchWebUiButton");
  });

  it("webui window opened", async function (done) {
    this.timeout(20000);
    var count = await this.app.client.getWindowCount();
    console.log("window count " + count);
    assert.equal(count, 5);
    await setTimeout(async () => {
      await util.activateWindow(this.app, "Alloy (Preview)");
      this.app.client.element("#loadedState").getHTML(false).should.eventually.equal("true");
      done();
    }, 5000);
  });
});