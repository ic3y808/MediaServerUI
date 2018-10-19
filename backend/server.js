const _ = require('underscore');
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const express = require('express');
const webpack = require('webpack');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const webpackconfig = require('../webpack.config');
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

process.env.DATA_DIR = path.join(__dirname, '..', "data");
if (!fs.existsSync(process.env.DATA_DIR)) fs.mkdirSync(process.env.DATA_DIR);

const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

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

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
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

var db = require('./core/database');
var index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));
app.set('view engine', 'jade');
app.use(function (req, res, next) {
  res.io = io;
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use("/", express.static(path.join(__dirname, '..', 'frontend')));
app.use("/node_modules/", express.static(path.join(__dirname, '..', 'node_modules')));
app.use("/bower_components/", express.static(path.join(__dirname, '..', 'bower_components')));
app.use("/controllers/", express.static(path.join(__dirname, '..', 'frontend', 'controllers')));
app.use("/factories/", express.static(path.join(__dirname, '..', 'frontend', 'factories')));

/* Configure Routes. */
app.use('/', index);

app.get('/template/:name', function (req, server) {
  server.render(req.params.name);
});
app.get('/artist/template/:name', function (req, server) {
  server.render(req.params.name);
});
app.get('/genre/template/:name', function (req, server) {
  server.render(req.params.name);
});

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

setInterval(function () {
  var dt = {
    date: moment().format("hh:mm:ss a | MM-DD-YYYY")
  };
  io.emit("ping", JSON.stringify(dt));
}, 1000);

server.listen(normalizePort(process.env.PORT || '3000'), () => {
  console.log('Example app listening on port 3000!')
});

server.on('error', onError);
server.on('listening', onListening);

process.env.JADE_PORT = normalizePort(process.env.JADE_PORT || '4567');
process.env.LIVE_RELOAD_PORT = normalizePort(process.env.LIVE_RELOAD_PORT || '35729');
var livereload = require('livereload').createServer({
  exts: ['jade'],
  port: process.env.JADE_PORT
});

livereload.watch(path.join(__dirname, '..', 'frontend', 'views'));