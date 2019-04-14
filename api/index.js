import App from "./app";
var app = new App();
app.create().then(() => {
  app.startServer();
});
