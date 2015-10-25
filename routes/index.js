var express = require('express');
var mysql  = require('mysql');
var router = express.Router();

/* Set connection parameters */
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'db',
  password : 'bruins111', // need a more secure method than hardcoding here
  database : 'test'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    
    // This makes a connection to the database and populates our initial server.
    connection.query('SELECT * FROM sources', function(err, rows, fields) {
        if (err) throw err;
        console.log(rows[0]["name"]);
        res.render('index', {title: 'Express', response:rows[0]["name"]});
    });

});

/* POST data to MySQL */
/*
router.post('/', function(req, res) {
   \\ implement connection here
};
*/

module.exports = router;
