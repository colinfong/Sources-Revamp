var express = require('express');
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'db',
  password : 'bruins111'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
