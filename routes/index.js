var express = require('express');
var session = require('express-session');
var Handlebars = require('hbs');
var mysql = require('mysql');
var passport = require('passport');
var url = require('url');
var queryHandler = require('querystring');
var https = require('https');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var router = express.Router();

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

router.get('/auth/google', function(req, res) {

    var queryContents = {
        response_type: 'code',
        client_id: "557716849061-upiujmrik7ah05fc92p0e4ki38a3fiu4.apps.googleusercontent.com",
        redirect_uri: 'http://127.0.0.1:3000/auth/google/callback/1',
        scope: 'email'
    };

    res.redirect('https:accounts.google.com/o/oauth2/auth?' + queryHandler.stringify(queryContents));

});

/* GET sources if logged in; if not, send to login. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.redirect('/sources');
});

/* Called when authentication finishes */
router.get('/auth/google/callback/1', function(req, res) {

    var response = url.parse(req.url, true)['query'];

    if (response.error) {

        console.log('There was an authentication error!');
        res.redirect('/login');

    } else {

        var queryContents = {
            code: response.code,
            client_id: "557716849061-upiujmrik7ah05fc92p0e4ki38a3fiu4.apps.googleusercontent.com",
            client_secret: 'nJ10A33GBagyT94ntGG0XNFa',
            redirect_uri: 'http://127.0.0.1:3000/auth/google/callback/2',
            grant_type: 'authorization_code'
        };
        
        console.log()

        var requestParams = {
            hostname: 'www.googleapis.com',
            path: '/oauth2/v3/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': queryHandler.stringify(queryContents).length
            }
        };

        var request = https.request(requestParams, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.log('BODY: ' + chunk);
            });
            res.on('end', function() {
                console.log('No more data in response.')
            });
        });

        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        request.write(queryHandler.stringify(queryContents));
        request.end();
    }
});

router.get('/auth/google/callback/2', function(req, res) {
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