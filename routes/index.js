var express = require('express');
var Handlebars = require('hbs');
var mysql = require('mysql');
var google = require('googleapis');
var url = require('url');
var configAuth = require('../helpers/configAuth');

var router = express.Router();

/* 

ALL AUTHENTICATION HAPPENS HERE 

This section includes the entire OAuth flow, and subsequent
verification processes. DO NOT MESS WITH THIS unless you wish
to address a TODO.

Routes:

'/auth/google/'
'auth/google/callback' 

Functions:

ensureAuthenticated

*/

// required libraries
var OAuth2 = google.auth.OAuth2; // for pure authentication purposes
var Profile = google.oauth2('v2'); // to obtain profile details

var oauth2Client = new OAuth2(configAuth.oauth.client_id, 
                              configAuth.oauth.client_secret, 
                              'http://127.0.0.1:3000/auth/google/callback'); // OAuth2 client to handle grunt work

// called when we want to begin authentication.
router.get('/auth/google', function(req, res) {

    var url = oauth2Client.generateAuthUrl({
        scope: 'email'
    });

    res.redirect(url);

});

// called as next step in authentication process, redirected from URL in previous call
router.get('/auth/google/callback', function(req, res) {

    var response = url.parse(req.url, true)['query']; // get authentication code

    if (response.error) {

        console.log(response.error); // print to terminal
        res.redirect('/login'); // send user back to login to try again

    } else {

        oauth2Client.getToken(response.code, function(err, tokens) {
            // Now tokens contains an access_token and an optional refresh_token. Save them.
            if (!err) {
                oauth2Client.setCredentials(tokens);
                res.redirect('/sources'); // TODO: Make this asynchronous so as not to impact user experience!
            }
        });

    }
});

// Ensure that user is authenticated whenever they try to access a protected resource
function ensureAuthenticated(req, res, next) {

    Profile.userinfo.v2.me.get({
        auth: oauth2Client
    }, function(err, response) {
        if (err || response.hd !== 'media.ucla.edu') {
            res.redirect('/login');
        } else {
            return next();
        }
    });
}

/* 

ALL DATABASE_SENSITIVE WORK HAPPENS HERE 

This section includes page routes that require database connection
requests. It also includes post requests to update database properties.

*/

// Set connection parameters
var connection = mysql.createConnection(configAuth.database);

// On accessing /sources, load sources from database
router.get('/sources', ensureAuthenticated, function(req, res) {

    connection.query('SELECT * FROM sources', function(err, rows, fields) {
        if (err) throw err;
        res.render('index', {
            title: 'Express',
            response: rows
        });
    });

});

/* 

ALL OTHER ROUTES ARE DEFINED HERE 

Current routes:

'/'
'/login'
'/sources' (see Database Section)

*/

// GET login page 
router.get('/login', function(req, res) {
    res.render('login');
});

// GET sources if logged in; if not, send to login.
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.redirect('/sources');
});

module.exports = router;