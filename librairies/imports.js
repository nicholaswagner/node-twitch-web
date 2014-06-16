exports.config = require('../config');
exports.http = require('http');
exports.passport = require('passport');
exports.path = require('path');
exports.strategy = require('./twitch').Strategy;

//Express modules.
exports.bodyparser = require('body-parser');
exports.cookieparser = require('cookie-parser');
exports.ejslocals = require('ejs-locals');
exports.favicon = require('serve-favicon');
exports.express = require('express');
exports.method = require('method-override');
exports.session = require('express-session');