const _ = require('underscore');
const fs = require("fs");
const path = require('path');
const shell = require('shelljs');
const { join } = require('path');
const moment = require('moment');
const express = require('express');
const webpack = require('webpack');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { readdirSync, statSync } = require('fs')
const webpackconfig = require('../webpack.config');
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

if (process.env.DEV === 'true') {
  process.env.DATA_DIR = path.join(__dirname, '..', "data");
} else {
  process.env.DATA_DIR = path.join(__dirname, '..', 'dist', "data");
}

if (!fs.existsSync(process.env.DATA_DIR)) shell.mkdir('-p', process.env.DATA_DIR);

var db = require('./core/database');
var log = require('./core/logger');
var index = require('./routes/index');
log.info('Starting up server');
log.info('Loading Plugins');
var sabnzbd = require('./core/plugins/sabnzbd');
var subsonic = require('./core/plugins/subsonic');


const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
sabnzbd.io = io;

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  switch (error.code) {
    case 'EACCES':
      log.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  sabnzbd.login();
  log.info('Listening on ' + bind);
}


app.use('/content', express.static(path.join(__dirname, '..', 'frontend', 'content')));

if (process.env.DEV === 'true') {
  const webpackCompiler = webpack(webpackconfig);
  const wpmw = webpackMiddleware(webpackCompiler, {});
  app.use(wpmw);
  const wphmw = webpackHotMiddleware(webpackCompiler);
  app.use(wphmw);
} else {
  app.use(express.static('dist'));
}

app.use(favicon(path.join(__dirname, '..', 'frontend', 'content', 'favicon.ico')));

// view engine setup
function flatten(lists) { return lists.reduce((a, b) => a.concat(b), []); }
function getDirectories(srcpath) { return fs.readdirSync(srcpath).map(file => path.join(srcpath, file)).filter(path => fs.statSync(path).isDirectory()); }
function getDirectoriesRecursive(srcpath) { return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))]; }
var componentdirs = getDirectoriesRecursive(path.join(__dirname, '..', 'frontend', 'components'))
var viewdirs = getDirectoriesRecursive(path.join(__dirname, '..', 'frontend', 'views'))

app.set('views', componentdirs.concat(viewdirs));
app.set('view engine', 'jade');
app.use(function (req, res, next) {
  res.io = io;
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/* Configure Routes. */
app.use('/', index);
app.use("/", express.static(path.join(__dirname, '..', 'frontend')));
app.use("/node_modules/", express.static(path.join(__dirname, '..', 'node_modules')));
app.use("/bower_components/", express.static(path.join(__dirname, '..', 'bower_components')));
app.use("/controllers/", express.static(path.join(__dirname, '..', 'frontend', 'controllers')));
app.use("/factories/", express.static(path.join(__dirname, '..', 'frontend', 'factories')));

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
  sabnzbd.socketConnect(socket);
  subsonic.socketConnect(socket);
  log.debug('Client connected');
  socket.on('log', function (data) {
    log.log(data.method, data.message);
  });
});

setInterval(function () {
  var dt = {
    date: moment().format("hh:mm:ss a | MM-DD-YYYY")
  };
  io.emit("ping", JSON.stringify(dt));
}, 1000);

server.listen(normalizePort(process.env.PORT || '3000'));

server.on('error', onError);
server.on('listening', onListening);

if (process.env.DEV === 'true') {

  process.env.JADE_PORT = normalizePort(process.env.JADE_PORT || '4567');
  var livereload = require('livereload').createServer({
    exts: ['jade'],
    port: process.env.JADE_PORT
  });

  livereload.watch(path.join(__dirname, '..', 'frontend'));
}