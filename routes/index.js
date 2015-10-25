var express = require('express');
var mysql  = require('mysql');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var router = express.Router();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// UNCOMMENT THE FOLLOWING ONCE A CLIENT ID AND SECRET ARE OBTAINED

//passport.use(new GoogleStrategy({
//    clientID: GOOGLE_CLIENT_ID,
//    clientSecret: GOOGLE_CLIENT_SECRET,
//    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
//  },
//  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
//    process.nextTick(function () {
//      return done(null, profile);
//    });
//  }
//));

router.use(passport.initialize());
router.use(passport.session());

/* Set connection parameters */
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'db',
  password : 'bruins111', // need a more secure method than hardcoding here
  database : 'test'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    
    // This makes a connection to the database and populates our initial response.
    connection.query('SELECT * FROM sources', function(err, rows, fields) {
        if (err) throw err;
        console.log(rows[0]);
        res.render('index', {title: 'Express', response:rows[0]});
    });

});

module.exports = router;
