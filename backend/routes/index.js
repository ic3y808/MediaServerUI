var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
  res.render('index', { title: 'MediaCenterUI', jade_port: process.env.LIVE_RELOAD_JADE_PORT, live_reload_port: process.env.LIVE_RELOAD_PORT, dev_mode: process.env.DEV === 'true' });
});
module.exports = router;