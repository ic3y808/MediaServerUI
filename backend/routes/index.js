var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Alloy (Preview)',
    jade_port: process.env.JADE_PORT,
    dev_mode: process.env.DEV === 'true'
  });
});
module.exports = router;