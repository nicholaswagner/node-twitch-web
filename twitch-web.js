var eg = require('ejs-locals'),
	ex = require('express'),
	hp = require('http'),
	pp = require('passport'),
	pt = require('path'),
	st = require('./librairies/twitch').Strategy;

/**
 * You will need to register a new application on Twitch.
 * Go to http://www.twitch.tv/kraken/oauth2/clients/new and create your application.
 * 
 * We suggest to use the callback url below when you register your application.
 * 
 * Once created, you will have your ClientID and SecretID.
 */
var TWITCHTV_CLIENT_ID = 'YOUR_CLIENT_ID';
var TWITCHTV_CLIENT_SECRET = 'YOUR_SECRET_ID';
var CALLBACK_URL = 'http://127.0.0.1/auth/twitch/callback';

/**
 * Use this middleware to protect a page.
 */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}

/**
 * Serialize / deserialize a user.
 */
pp.serializeUser(function(user, done) {
	done(null, user);
});

pp.deserializeUser(function(obj, done) {
	done(null, obj);
});

/**
 * Use Twitch Strategy along with passport to retrieve the user's informations.
 */
pp.use(new st({
	clientID: TWITCHTV_CLIENT_ID,
	clientSecret: TWITCHTV_CLIENT_SECRET,
	callbackURL: CALLBACK_URL,
	scope: "user_read"
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));

/**
 * Setting up express.
 */
var app = ex();

app.set('port', process.env.PORT || 80);
app.engine('ejs', eg);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(ex.favicon());
app.use(ex.cookieParser());
app.use(ex.bodyParser());
app.use(ex.methodOverride());
app.use(ex.session({ secret: 'keyboard cat' }));
app.use(pp.initialize());
app.use(pp.session());
app.use(app.router);
app.use(ex.static(pt.join(__dirname, 'public')));


/**
 * Routes
 */

app.get('/', function(req, res){
  res.render('index', { title: 'Hello', user: req.user });
});

// User must be logged in to see the content of this page.
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { title: 'Hello', user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { title: 'Hello', user: req.user });
});

// Redirect the user to Twitch for authentication.
app.get('/auth/twitch', pp.authenticate('twitch', { scope: ['user_read'] }), function(req, res){
	//
});

// Authenticate the user.
app.get('/auth/twitch/callback', pp.authenticate('twitch', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

hp.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
