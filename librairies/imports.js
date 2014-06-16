var config = require('../config'),
	http = require('http'),
	passport = require('passport'),
	path = require('path'),
	strategy = require('./twitch').Strategy,
	
	// Express modules.
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	ejslocals = require('ejs-locals'),
	favicon = require('serve-favicon'),
	express = require('express'),
	method = require('method-override'),
	session = require('express-session');


exports.config = config;
exports.http = http;
exports.passport = passport;
exports.path = path;
exports.strategy = strategy;

//Express modules.
exports.bodyparser = bodyparser;
exports.cookieparser = cookieparser;
exports.ejslocals = ejslocals;
exports.favicon = favicon;
exports.express = express;
exports.method = method;
exports.session = session;