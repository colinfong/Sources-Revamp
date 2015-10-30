var express = require('express');
var Handlebars = require('hbs');
var mysql = require('mysql');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var cookieParser = require('cookie-parser');

var router = express.Router();

router.use(cookieParser());

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(obj, done) {
    return done(null, obj);
});

passport.use(new GoogleStrategy({
        // TODO: in production, hide the following somehow
        clientID: "557716849061-upiujmrik7ah05fc92p0e4ki38a3fiu4.apps.googleusercontent.com",
        clientSecret: "nJ10A33GBagyT94ntGG0XNFa",
        callbackURL: "http://127.0.0.1:3000/auth/google/callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({
            googleId: profile.id
        }, function(err, user) {
            return done(err, user);
        });
    }
));

/* Set connection parameters */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'db',
    password: 'bruins111', // TODO: need a more secure method than hardcoding here
    database: 'test'
});

/* GET login page */
router.get('/login', function(req, res) {
    res.render('login');
});

/* POST for login */
router.post('/login', passport.authenticate('google', {
    scope: 'openid profile email'
}));

/* GET sources if logged in; if not, send to login. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.redirect('/sources');
});

/* Called when authentication finishes */
router.get('/auth/google/callback', function(req, res) {
    res.redirect('/sources');
});

// Ensure that user is authenticated whenever
// they try to access a protected resource
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // Nice try, buster
        res.redirect('/login');
    }
}

/* GET sources page */
router.get('/sources', ensureAuthenticated, function(req, res) {

    connection.query('SELECT * FROM sources', function(err, rows, fields) {
        if (err) throw err;
        res.render('index', {
            title: 'Express',
            response: rows
        });
    });

});

module.exports = router;