/**
 * Create a new application at http://www.twitch.tv/kraken/oauth2/clients/new
 * 
 * Use http://127.0.0.1/auth/twitch/callback as the default callback. Change the port in the URL
 * if you start the web server on a different port.
 * 
 * You will also need a Mongo database, get one for free at https://mongolab.com/signup/
 * then create a new database, select it and you will get the URL of the database.
 */
var config = {};

config.clientID =  '';
config.clientSecret = '';
config.callbackURL =  'http://127.0.0.1/auth/twitch/callback';

// Port of the web server.
config.port =  80;

// Mongo database URL.
config.mongoURL = 'mongodb://<username>:<password>@<address>:<port>/<database>';

// Max age for sessions.
config.sessionMaxAge = 300000;

// Cookies and sessions secret phrases.
config.cookieSecret = 'SuperSecret';
config.sessionSecret = 'SuperSecret';

module.exports = config;