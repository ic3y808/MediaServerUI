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
    assert.equal(count, 3);
    await util.activateWindow(this.app, "Alloy");
    await this.app.client.element("#loadedState").getHTML(false).should.eventually.equal("true");
  });

  it("api server sent api-server-loaded-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("api-server-loaded-result").value().should.equal("success");
    }, 250);
  });

  it("media scanner sent mediascanner-loaded-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("mediascanner-loaded-result").value().should.equal("success");
    }, 500);
  });

  it("renderer sent app-loaded-result to ipcMain", async function () {
    this.db.read();
    await setTimeout(async () => {
      await this.db.get("app-loaded-result").value().should.equal("success");
    }, 500);
  });

  it("main ui shows library count of 0", async function () {
    await this.app.client.element("#libraryTotalCountRow").getHTML(false).should.eventually.equal("0");
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

  it("can rescan the library", function (done) {
    util.click(this.app, "#rescanLibraryButton").then(() => {
      setTimeout(() => {
        done();
      }, 500);
    });
  });

  it("main ui shows ibrary albums count of 1", async function () {
    await this.app.client.element("#libraryAlbumsCountRow").getHTML(false).should.eventually.equal("1");
  });

  it("main ui shows ibrary artists count of 1", async function () {
    await this.app.client.element("#libraryArtistsCountRow").getHTML(false).should.eventually.equal("1");
  });

  it("main ui shows ibrary genres count of 1", async function () {
    await this.app.client.element("#libraryGenreCountRow").getHTML(false).should.eventually.equal("1");
  });

  it("main ui shows ibrary total count of 1", async function () {
    await this.app.client.element("#libraryTotalCountRow").getHTML(false).should.eventually.equal("1");
  });


  it("can open webui window", function (done) {
    util.click(this.app, "#launchWebUiButton").then(() => {
      setTimeout(() => {
        done();
      }, 1000);
    });
  });

  it("webui window opened", function (done) {
    this.timeout(20000);
    this.app.client.getWindowCount().then((count) => {
      console.log("window count " + count);
      assert.equal(count, 5);
      setTimeout(() => {
        util.activateWindow(this.app, "Alloy (Preview)").then(() => {
          this.app.client.element("#loadedState").getHTML(false).should.eventually.equal("true");
          done();
        });
      }, 1000);
    });
  });
});