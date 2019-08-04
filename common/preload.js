var { ipcMain, remote } = require("electron");
const fs = require("fs");
const low = require("lowdb");
const path = require("path");
const shell = require("shelljs");
const dataDir = path.join(__dirname, "..", "test_data");
const demoArtistDir = path.join(__dirname, "..", "test", "test_media", "Spiritualized");
const testMediaDir = path.join(dataDir, "MediaRoot");
const FileSync = require("lowdb/adapters/FileSync");

//clear data
if (fs.existsSync(dataDir)) { shell.rm("-r", dataDir); }
shell.mkdir("-p", dataDir);
shell.mkdir("-p", testMediaDir);
shell.cp("-r", demoArtistDir, testMediaDir);

//load fresh db
const adapter = new FileSync(path.join(dataDir, "db.json"));
const db = low(adapter);

//use this script to update db.json from the IPC events the renderer sends to ipcMain
ipcMain.on("app-loaded-result", (s, data) => {
  db.set("app-loaded-result", data).write();
});
ipcMain.on("api-server-loaded-result", (s, data) => {
  db.set("api-server-loaded-result", data).write();
});
ipcMain.on("scheduler-load-result", (s, data) => {
  db.set("scheduler-load-result", data).write();
});
ipcMain.on("mediascanner-loaded-result", (s, data) => {
  db.set("mediascanner-loaded-result", data).write();
});
ipcMain.on("app-ipc-test-result", (s, data) => {
  db.set("app-ipc-test-result", data).write();
});