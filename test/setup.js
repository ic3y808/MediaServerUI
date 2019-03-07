process.env.MODE = 'prod';
var App = require('../api/app');

// use it in your mocha tests
global.setupEnv = function setupEnv(before, after) {
  var app = new App();
  // just describe needed vars
  var env = Object.create(null);

  // setup
  before(function (next) {
    app.create().then(() => {
      env.app = app.app;
      app.startServer(server => {
        env.server = server;
        next();
      })
    });

  });

  // teardown
  after(function () {
    setTimeout(() => {
      if (app) app.stopServer();
    }, 1000);
  });

  return env;
}