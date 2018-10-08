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
var host = process.env.APP_HOST || 'localhost';
var publicPath = path.resolve(__dirname, '..', 'public');
process.env.DATA_DIR = path.join(__dirname, '..', "data");

if (!fs.existsSync(process.env.DATA_DIR)) {
  fs.mkdirSync(process.env.DATA_DIR);
}

var db = require('./core/database');
var index = require('./routes');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (process.env.DEV === 'true') {
  app.all(['/assets/*', '*.hot-update.json'], function (req, res) {
    proxy.web(req, res, {
      target: 'http://' + host + ':3001'
    });
  });

  var livereload = require('easy-livereload');
  var file_type_map = {
    jade: 'html', // `index.jade` maps to `index.html`
    styl: 'css', // `styles/site.styl` maps to `styles/site.css`
    scss: 'css', // `styles/site.scss` maps to `styles/site.css`
    sass: 'css', // `styles/site.scss` maps to `styles/site.css`
    less: 'css' // `styles/site.scss` maps to `styles/site.css`
    // add the file type being edited and what you want it to be mapped to.
  };

  // store the generated regex of the object keys
  var file_type_regex = new RegExp('\\.(' + Object.keys(file_type_map).join('|') + ')$');

  app.use(livereload({
    watchDirs: [
      path.join(__dirname, 'views'),
      path.join(__dirname, '..', 'frontend')
    ],
    checkFunc: function (file) {
      console.log(file);
      return file_type_regex.test(file);
    },
    renameFunc: function (file) {
      // remap extention of the file path to one of the extentions in `file_type_map`
      return file.replace(file_type_regex, function (extention) {
        return '.' + file_type_map[extention.slice(1)];
      });
    },
    port: process.env.LIVERELOAD_PORT || 35729
  }));
} else {
  app.use(express.static(publicPath));
};

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
  // Any requests to localhost:3000/assets is proxied
  // to webpack-dev-server

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
  var dt = {
    date: moment().format("hh:mm:ss a | MM-DD-YYYY")
  };
  io.emit("ping", JSON.stringify(dt));
}, 1000);

module.exports = {
  app: app,
  server: server
};