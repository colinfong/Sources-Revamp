# About

This folders contains helper functions that are useful within our application such as a `configAuth` file that lets us handle confidential information.

Below is a skeletion of the contents of the `configAuth.js` file (so as to allow developers to understand its structure if not view the private information itself):

```var configs = {database:{
        host: "[Hostname of database]",
        user: "[Username]",
        password: "[Password]",
        database: "[Database Name]"
    },
    oauth: { // for Google only
        client_id: "[CLIENT ID].apps.googleusercontent.com",
        client_secret: "[CLIENT SECRET]"
    }};
    
    module.exports = configs;
```