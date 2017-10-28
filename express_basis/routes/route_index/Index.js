var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index_page/index', { title: '欢迎' });
});

module.exports = router;
