var express = require('express');
var Handlebars = require('hbs');
var mysql = require('mysql');
var google = require('googleapis');
var url = require('url');
var bodyParser = require('body-parser');
var _ = require('lodash')

var configAuth = require('../helpers/configAuth');

var knex = require('knex')({
    client: 'mysql',
    connection: configAuth.database
});

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

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

ALL DATABASE-SENSITIVE WORK HAPPENS HERE 

This section includes page routes that require database connection
requests. It also includes post requests to update database properties.

*/

// Set connection parameters
var connection = mysql.createConnection(configAuth.database);

// On accessing /sources, load sources from database
router.get('/sources', ensureAuthenticated, function(req, res) {

    knex.select().table('sources')
        .then(
            function(rows) {
                res.render('index', {
                    title: 'Express',
                    response: rows
                });
            })
        .catch(function(error) {
            console.error(error);
        });

});

// on edit, POST the data to MySQL.

// implement method here.
router.post('/edit', ensureAuthenticated, function(req, res, next) {
    console.log(req.body);
});

// on delete, POST the data to MySQL.

router.post('/delete', ensureAuthenticated, function(req, res, next) {
    var colNames = ['name','title','org','workPhone','cellPhone','otherPhone', 'workEmail', 'personalEmail', 'notes'];
    // Lodash creates an object by combining key array and value array
    var data = _.object(colNames, req.body);
    console.log(data);
    knex('sources').where(data).del().then(function(num) {
        console.log('Deleted '+ num +' rows');
    });
});

// We don't use a method to update MySQL on clicking 'Add'.
// 'Add' creates a new, useless row - only push changes when users edit something.

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