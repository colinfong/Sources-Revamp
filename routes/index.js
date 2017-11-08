const express = require('express');
const Handlebars = require('hbs');
const google = require('googleapis');
const url = require('url');
const bodyParser = require('body-parser');
const _ = require('lodash'); // generally useful library!

// configuration settings
const configAuth = require('../helpers/configAuth');

// An optimised SQL query builder!
const knex = require('knex')({
  client: 'mysql',
  connection: configAuth.database,
});

const router = express.Router();
// the following are needed to ensure JSON data sent through POST
// requests are correctly decoded.
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

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
const OAuth2 = google.auth.OAuth2; // for pure authentication purposes
const Profile = google.oauth2('v2'); // to obtain profile details

const oauth2Client = new OAuth2(
  configAuth.oauth.client_id,
  configAuth.oauth.client_secret,
  'http://sources.dailybruin.com/auth/google/callback'
); // OAuth2 client to handle grunt work

// called when we want to begin authentication.
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: 'email',
  });

  res.redirect(url);
});

// called as next step in authentication process, redirected from URL in previous call
router.get('/auth/google/callback', (req, res) => {
  const response = url.parse(req.url, true).query; // get authentication code

  if (response.error) {
    console.log(response.error); // print to terminal
    res.redirect('/login'); // send user back to login to try again
  } else {
    oauth2Client.getToken(response.code, (err, tokens) => {
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
  Profile.userinfo.v2.me.get(
    {
      auth: oauth2Client,
    },
    (err, response) => {
      if (err || response.hd !== 'media.ucla.edu') {
        res.redirect('/login');
      } else {
        return next();
      }
    }
  );
}

/*

ALL DATABASE-SENSITIVE WORK HAPPENS HERE

This section includes page routes that require database connection
requests. It also includes post requests to update database properties.

*/

// On accessing /sources, load sources from database
router.get('/sources', ensureAuthenticated, (req, res) => {
  knex
    .select()
    .table('sources')
    .then(rows => {
      res.render('index', {
        title: 'Daily Bruin Sources',
        response: rows,
      });
    })
    .catch(error => {
      console.error(error);
    });
});

/* on add, POST the data to MySQL */

router.post('/add', ensureAuthenticated, (req, res) => {
  const colNames = ['name', 'org', 'phones', 'emails', 'notes'];

  const data = _.object(colNames, req.body);

  knex('sources')
    .insert(data)
    .then(array => {
      console.log(array);
      res.status(204).end();
    })
    .catch(error => {
      console.error(error);
      res.status(204).end();
    });
});

// on edit, POST the data to MySQL.

router.post('/edit', ensureAuthenticated, (req, res) => {
  const colNames = ['name', 'org', 'phones', 'emails', 'notes'];

  const oldData = _.object(colNames, req.body.old);
  const newData = _.object(colNames, req.body.new);

  knex('sources')
    .where(oldData)
    .update(newData)
    .then(num => {
      console.log(`Updated ${num} rows`);
      res.status(204).end();
    })
    .catch(error => {
      console.error(error);
      res.status(204).end();
    });
});

// on delete, POST the data to MySQL.

router.post('/delete', ensureAuthenticated, (req, res) => {
  const colNames = ['name', 'org', 'phones', 'emails', 'notes'];
  // Lodash creates an object by combining key array and value array

  const data = _.object(colNames, req.body);

  knex('sources')
    .where(data)
    .del()
    .then(num => {
      console.log(`Deleted ${num} rows`);
      res.status(204).end();
    })
    .catch(error => {
      console.error(error);
      res.status(204).end();
    });
});

// We don't use a method to update MySQL on clicking 'Add'.
// 'Add' creates a new, useless row for now - when we have edit interface this should work correctly.

/*

ALL OTHER ROUTES ARE DEFINED HERE

Current routes:

'/'
'/login'
'/sources' (see Database Section)

*/

// GET login page
router.get('/login', (req, res) => {
  res.render('login');
});

// GET sources if logged in; if not, send to login.
router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/sources');
});

module.exports = router;
