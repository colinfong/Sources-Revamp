# Sources-Revamp

A redo of the current internal [sources website](sources.dailybruin.com) to:

- Move away from Google Sheets as our data store, and use MySQL instead
- Add Google OAuthentication for our `@media.ucla.edu` emails
- Serve up a snazzy front-end
- Make the list of sources editable


## Installation 

### Getting the Repo

1. Find a folder you'd like to hold this code in.
2. Navigate to it, e.g., `cd /Users/user/Code/`
3. Clone this repo: `git clone https://github.com/daily-bruin/Sources-Revamp.git`


### Node.js and NPM

Next, you'll need Node and npm to run a local server instance: 

1. Install [Homebrew](http://brew.sh).
2. Install Node.js: `brew install node`
3. Install npm: `brew install npm`
4. Install dependencies with `npm intall`


### MySQL 

For local testing: 

1. Use Homebrew to install MySQL: `brew install mysql`
2. Start mysql with `mysql.server start` or if it's already running:
   `mysql.server restart`
3. Change the password [for root](http://www.cyberciti.biz/faq/mysql-change-root-password/)
4. Launch the MySQL REPL as `mysql` in Bash
5. Create a new user `db` with password `bruins111`: `CREATE USER db IDENTIFIED
   BY 'bruins111';`
6. Give them privileges to the default `test` database (comes with a fresh
   MySQL install): `GRANT ALL PRIVILEGES ON test.* TO db@localhost;`
7. Head over to `app.js` to [set-up the database connection](http://expressjs.com/guide/database-integration.html#mysql). A more detailed example can be found [here](https://gist.github.com/clarle/3180770)










