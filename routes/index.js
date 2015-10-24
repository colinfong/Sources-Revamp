var express = require('express');
var mysql      = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'db',
  password : 'bruins111'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    connection.start();
    var response = connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });
    res.render('index', { title: 'Express', response: response});
});

/* POST data to MySQL */
//router.post('/', function(req, res) {
//    connection.start();
//    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//        if (err) throw err;
//        console.log('The solution is: ', rows[0].solution);
//    });
//    connection.end();
//});

});

module.exports = router;
