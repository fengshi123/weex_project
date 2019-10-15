var express = require('express');
var router = express.Router();

var tokenDao = require('../dao/tokenDao');

router.use('/', function (req, res, next) {
  console.log(req.method === 'OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send('GET,HEAD');
  } else {
    tokenDao.getToken(req, res, next);
  }
});
module.exports = router;
