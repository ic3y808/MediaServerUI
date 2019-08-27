var express = require("express");
var router = express.Router();
//required extra routes to supply variables

router.get("/", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/activity/", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/activity/:name", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/artists", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/artist/:name", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/albums", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/album/:name", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/album/:name/:trackid", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/charts", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/config/", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/config/:name", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/database", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/fresh", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/genres", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/genre/:name", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/history", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/index", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/login", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/neverplayed", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/playlist", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/playlist/:id", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/playlists", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/register", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/share/:id", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/starred", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/status", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

router.get("/playing", function (req, res) {
  res.render("index", res.locals.jadeOptions);
});

module.exports = router;