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

1. Install [Homebrew](http://brew.sh)   .
2. Install Node.js: `brew install node`
3. Install npm: `brew install npm`
4. Install dependencies with `npm install`
5. By default, you can start the server with `node ./bin/www`. When in doubt, consult the `start` field in `package.json` for the right start command.

On Linux, you can also do a native install of NodeJS from [this tutorial](http://www.hostingadvice.com/how-to/install-nodejs-ubuntu-14-04/). 

### MySQL 

For local testing: 

1. You may use any instance of the MySQL server. On Mac, install [Homebrew](http://brew.sh) and continue on to step 2. See [instructions for Linux](https://www.linode.com/docs/databases/mysql/how-to-install-mysql-on-ubuntu-14-04) and [instructions for Windows](http://corlewsolutions.com/articles/article-21-how-to-install-mysql-server-5-6-on-windows-7-development-machine), and continue to step 3.
2. Use Homebrew to install MySQL: `brew install mysql`
3. Start mysql with `mysql.server start` or if it's already running:
   `mysql.server restart`
3. Change the password [for root](http://www.cyberciti.biz/faq/mysql-change-root-password/)
4. Launch the MySQL REPL as `mysql` in Bash
5. Create a new user `db` with password `bruins111`: `CREATE USER db`
6. Change the password for the new user: `update mysql.user set password=PASSWORD('bruins111') where User='db';`. ([Original tutorial](http://www.liquidweb.com/kb/change-a-password-for-mysql-on-linux-via-command-line/))
7. Give them privileges to the default `test` database (comes with a fresh
   MySQL install): `GRANT ALL PRIVILEGES ON test.* TO db@localhost;`
8. Reload all the permissions: `flush privileges;`
9. Head over to `app.js` to [set-up the database connection](http://expressjs.com/guide/database-integration.html#mysql). A more detailed example can be found [here](https://gist.github.com/clarle/3180770)

### Schema 

1. Inside of the MySQL REPL, switch over to the `test` database: `use test`
2. Create a new table: 

```
CREATE TABLE sources (
    name VARCHAR(60),
    org VARCHAR(500),
    phones VARCHAR(500),
    emails VARCHAR(500),
    notes VARCHAR(1000)
);
```

3. And insert a test row: 

``` 
INSERT INTO sources VALUES (
"Bob Bobsworth", 
"(UCPD: Assistant Cop), (ASUCLA: Architect of Dreams, Chief Ambassador)", 
"(Work: 000-000-0000), (Cell: 512-512-5121, 111-111-1111)", 
"(Work: bobbob@boba.com), (Personal: hotstuff@cool4lyf.com)", 
"Emotionally unavailable"
);
```
