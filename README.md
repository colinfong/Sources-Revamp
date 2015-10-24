# Sources-Revamp

A redo of the current internal [sources website](sources.dailybruin.com) to:

- Move away from Google Sheets as our data store, and use MySQL instead
- Add Google OAuthentication for our `@media.ucla.edu` emails
- Serve up a snazzy front-end
- Make the list of sources editable


## Installation 


### MySQL 

For local testing: 

1. You may use any instance of the MySQL server. On Mac, install [Homebrew](http://brew.sh) and continue to step 2. See [instructions for Linux](https://www.linode.com/docs/databases/mysql/how-to-install-mysql-on-ubuntu-14-04) and [instructions for Windows](http://corlewsolutions.com/articles/article-21-how-to-install-mysql-server-5-6-on-windows-7-development-machine), and continue to step 3.
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










