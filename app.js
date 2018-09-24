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


process.env.DATA_DIR = path.join(__dirname, "data");

if (!fs.existsSync(process.env.DATA_DIR)) {
	fs.mkdirSync(process.env.DATA_DIR);
}

var db = require('./core/database');
var index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function (req, res, next) { res.io = io; next(); });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/node_modules/", express.static(path.join(__dirname, 'node_modules')));
app.use("/bower_components/", express.static(path.join(__dirname, 'bower_components')));
app.use("/CSS/", express.static(path.join(__dirname, 'CSS')));
app.use("/JS/", express.static(path.join(__dirname, 'JS')));
app.use("/controllers/", express.static(path.join(__dirname, 'controllers')));
app.use("/factories/", express.static(path.join(__dirname, 'factories')));

/* Configure Routes. */
app.use('/', index);

app.get('/template/:name', function(req, server) {  server.render(req.params.name); });
app.get('/artist/template/:name', function(req, server) {  server.render(req.params.name); });
 
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
	socket.on('save_settings',function(settings){
		console.log('save_settings');
		db.saveSettings(settings, function(result){
			console.log('settings saved');
		})
	});
	socket.on('load_settings',function(){
		console.log('load_settings');
		db.loadSettings(function(result){
			socket.emit('settings_event', result);
		})
	});
});

setInterval(function () {
	var dt = { date: moment().format("hh:mm:ss a | MM-DD-YYYY") };
	io.emit("ping", JSON.stringify(dt));
}, 1000);

module.exports = {
	app: app,
	server: server
};