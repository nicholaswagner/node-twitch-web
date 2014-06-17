var web = require('./librairies/imports');

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
web.passport.serializeUser(function(user, done) {
	done(null, user);
});

web.passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

/**
 * Use Twitch Strategy along with passport to retrieve the user's informations.
 */
web.passport.use(new web.strategy({
	clientID: web.config.clientID,
	clientSecret: web.config.clientSecret,
	callbackURL: web.config.callbackURL,
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
var app = web.express();

app.set('port', process.env.PORT || web.config.port);
app.engine('ejs', web.ejslocals);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(web.favicon(__dirname + '/public/favicon.ico'));
app.use(web.cookieparser(web.config.cookieSecret));
app.use(web.bodyparser());
app.use(web.method());
var session = web.session({
    store: new web.mongosession({
          url: web.config.mongoURL,
          maxAge: web.config.sessionMaxAge
    }),
    secret: web.config.sessionSecret
});
app.use(session);
app.use(web.passport.initialize());
app.use(web.passport.session());
app.use(web.express.static(web.path.join(__dirname, 'public')));


/**
 * Routes
 */
app.get('/', function(req, res){
	res.render('index', { user: req.user });
});

// User must be logged in to see the content of this page.
app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
	res.render('login', { user: req.user });
});

// Redirect the user to Twitch for authentication.
app.get('/auth/twitch', web.passport.authenticate('twitch', { scope: ['user_read'] }), function(req, res){
	//
});

// Authenticate the user.
app.get('/auth/twitch/callback', web.passport.authenticate('twitch', { failureRedirect: '/login' }), function(req, res) {
	res.redirect('/');
});

// Logout the user.
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

web.http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
