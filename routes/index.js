var express = require('express');
var mysql  = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'db',
  password : 'bruins111',
  database: 'test'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    
    connection.query('SELECT * FROM sources', function(err, rows, fields) {
        if (err) throw err;
        console.log(rows[0]["name"]);
        res.render('index', {title: 'Express', response:rows[0]["name"]});
    });

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

module.exports = router;
