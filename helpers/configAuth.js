/* 

This file handles all authentication components with the database
and Google. 

In production: put this file under .gitignore! 

*/

const configs = {
  database: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABASE
  },
  oauth: {
    client_id: process.env.G_CLIENT_ID,
    client_secret: process.env.G_CLIENT_SECRET
  }
};

module.exports = configs;
