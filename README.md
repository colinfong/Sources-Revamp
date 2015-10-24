# Sources-Revamp

A redo of the current internal [sources website](sources.dailybruin.com) to:

- Move away from Google Sheets as our data store, and use MySQL instead
- Add Google OAuthentication for our `@media.ucla.edu` emails
- Serve up a snazzy front-end
- Make the list of sources editable


## Installation 


### MySQL 

For local testing: 

1. Install [Homebrew](http://brew.sh).
2. Use Homebrew to install MySQL: `brew install mysql`
3. Start mysql with `mysql.server start` or if it's already running:
   `mysql.server restart`
4. Change the password [for root](http://www.cyberciti.biz/faq/mysql-change-root-password/)
5. Launch the MySQL REPL as `mysql` in Bash
6. Create a new user `db` with password `bruins111`: `CREATE USER db IDENTIFIED
   BY 'bruins111';`
7. Give them privileges to the default `test` database (comes with a fresh
   MySQL install): `GRANT ALL PRIVILEGES ON test.* TO db@localhost;`
8. Head over to `app.js` to [set-up the database connection](http://expressjs.com/guide/database-integration.html#mysql). A more detailed example can be found [here](https://gist.github.com/clarle/3180770)










