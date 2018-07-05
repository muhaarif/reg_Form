var express = require('express');
var router = express.Router();

var ENV = process.env.NODE_ENV;

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (ENV === 'production') {
    res.sendFile("config/production.json", { root: './src' });
  } else if (ENV === 'alpha') {
    res.sendFile("config/alpha.json", { root: './src' });
  } else {
    res.sendFile("config/default.json", { root: './src' });
  }
});

module.exports = router;
