var _ = require('underscore');
var fs = require("fs");
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var CryptoJS = require("crypto-js");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

var isProduction = process.env.NODE_ENV === 'production';
var host = process.env.APP_HOST || 'localhost';

process.env.DATA_DIR = path.join(__dirname, '..', "data");

if (!fs.existsSync(process.env.DATA_DIR)) {
  fs.mkdirSync(process.env.DATA_DIR);
}

var db = require('./core/database');
var index = require('./routes');

if (!isProduction) {
  // Any requests to localhost:3000/assets is proxied
  // to webpack-dev-server
  app.all(['/assets/*', '*.hot-update.json'], function (req, res) {
    proxy.web(req, res, {
      target: 'http://' + host + ':3001'
    });
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function (req, res, next) { res.io = io; next(); });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/* Configure Routes. */
app.use('/', index);

app.get('/template/:name', function (req, server) { server.render(req.params.name); });
app.get('/artist/template/:name', function (req, server) { server.render(req.params.name); });
app.get('/genre/template/:name', function (req, server) { server.render(req.params.name); });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (process.env.DEV === 'true') {
  app.locals.pretty = true;
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

io.on('connection', function (socket) {
  console.log('connected');
  socket.on('save_settings', function (settings) {
    console.log('save_settings');
    db.saveSettings(settings, function (result) {
      console.log('settings saved');
    })
  });
  socket.on('load_settings', function () {
    console.log('load_settings');
    db.loadSettings(function (result) {
      socket.emit('settings_event', result);
    })
  });
});

proxy.on('error', function (e) {
  console.log('Could not connect to proxy, please try again...');
});


setInterval(function () {
  var dt = { date: moment().format("hh:mm:ss a | MM-DD-YYYY") };
  io.emit("ping", JSON.stringify(dt));
}, 1000);

module.exports = {
  app: app,
  server: server
};