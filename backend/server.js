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

app.use(express.static('www'));
app.use('/content', express.static(path.join(__dirname, '..', 'frontend', 'content')));
const webpackCompiler = webpack(webpackconfig);
const wpmw = webpackMiddleware(webpackCompiler, {});
app.use(wpmw);
const wphmw = webpackHotMiddleware(webpackCompiler);
app.use(wphmw);

const index = require('./routes');
const db = require('./core/database');

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

app.use('/', index);

app.use(favicon(path.join(__dirname, '..', 'frontend', 'content', 'favicon.ico')));

app.get('/template/:name', function (req, server) {
  server.render(req.params.name);
});
app.get('/artist/template/:name', function (req, server) {
  server.render(req.params.name);
});
app.get('/genre/template/:name', function (req, server) {
  server.render(req.params.name);
});

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

server.listen(normalizePort(process.env.PORT || '3000'), () => {
  console.log('Example app listening on port 3000!')
});

server.on('error', onError);
server.on('listening', onListening);

var livereload = require('livereload').createServer({
  exts: ['jade'],
  port: 4567
});

livereload.watch(path.join(__dirname, '..', 'frontend', 'views'));

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
  var dt = { date: moment().format("hh:mm:ss a | MM-DD-YYYY") };
  io.emit("ping", JSON.stringify(dt));
}, 1000);