var express = require("express");
var router = express.Router();
//required extra routes to supply variables
var registeredRoutes = [
  "/",
  "/activity",
  "/activity/:name",
  "/artists",
  "/artist/:name",
  "/albums",
  "/album/:name",
  "/charts",
  "/config",
  "/config/:name",
  "/fresh",
  "/genres",
  "/genre/:name",
  "/history",
  "/login",
  "/neverplayed",
  "/playing",
  "/playlist",
  "/playlist/:id",
  "/playlists",
  "/recent",
  "/register",
  "/share/:id",
  "/starred",
  "/status"
];

registeredRoutes.forEach((route)=>{
  router.get(route, function (req, res) {
    res.render("index", res.locals.jadeOptions);
  });
});

module.exports = router;