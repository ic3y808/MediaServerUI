var express = require('express');
var router = express.Router();
var options = {
  title: 'Alloy (Preview)',
  jade_port: process.env.JADE_PORT,
  dev_mode: process.env.MODE === 'dev'
};

//template renderer

router.get('/template/:name', function (req, res) {
  res.render(req.params.name, options);
});

//required extra routes to supply variables

router.get('/', function (req, res) {
  res.render('index', options);
});

router.get('/activity/', function (req, res) {
  res.render('index', options);
});

router.get('/activity/:name', function (req, res) {
  res.render('index', options);
});

router.get('/artists', function (req, res) {
  res.render('index', options);
});

router.get('/artist/:name', function (req, res) {
  res.render('index', options);
});

router.get('/albums', function (req, res) {
  res.render('index', options);
});

router.get('/album/:name', function (req, res) {
  res.render('index', options);
});

router.get('/album/:name/:trackid', function (req, res) {
  res.render('index', options);
});

router.get('/charts', function (req, res) {
  res.render('index', options);
});

router.get('/config/', function (req, res) {
  res.render('index', options);
});

router.get('/config/:name', function (req, res) {
  res.render('index', options);
});

router.get('/database', function (req, res) {
  res.render('index', options);
});

router.get('/fresh', function (req, res) {
  res.render('index', options);
});

router.get('/genres', function (req, res) {
  res.render('index', options);
});

router.get('/genre/:name', function (req, res) {
  res.render('index', options);
});

router.get('/history', function (req, res) {
  res.render('index', options);
});

router.get('/index', function (req, res) {
  res.render('index', options);
});

router.get('/playlist', function (req, res) {
  res.render('index', options);
});

router.get('/playlist/:id', function (req, res) {
  res.render('index', options);
});

router.get('/playlists', function (req, res) {
  res.render('index', options);
});

router.get('/starred', function (req, res) {
  res.render('index', options);
});

router.get('/status', function (req, res) {
  res.render('index', options);
});

router.get('/playing', function (req, res) {
  res.render('index', options);
});

module.exports = router;