var App = require("./app");
var app = new App();
app.create().then(() => {
  app.startServer();
});
