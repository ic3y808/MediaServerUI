module.exports.activateWindow = async function activateWindow(app, title) {
  var found = false;
  var handles = await app.client.windowHandles();
  for (let index = 0; index < handles.value.length; index++) {
    if (found) { return; }
    try {
      await app.client.windowByIndex(index);
      var windowTitle = await app.client.getTitle();
      if (windowTitle.match(title)) {
        found = true;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports.click = function (app, selector) {
  return new Promise((resolve, reject) => {
    app.client.element(selector).click().then(function () {
      setTimeout(() => { resolve(); }, 250);
    });
  });
};

module.exports.getOutput = async function (app) {
  if (app && app.isRunning()) {
    var logs = await app.client.getMainProcessLogs();
    return logs;
  }
};