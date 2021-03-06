// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var passport = require('passport')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sequelize_fixtures = require('sequelize-fixtures');
var models = require('./models');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Requiring our models for syncing
var hobbyhookupdb = require("./models");
// var setupPassport = require('./passport.js');

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("./public"));


// Routes =============================================================

//	¯\_(ツ)_/¯

require("./routes/hobby-routes.js")(app);
require("./routes/messages-route.js")(app);

// app.use(express.static('./server/static/'));
// app.use(express.static('./client/dist/'));
app.use(passport.initialize());


// //Setting up login 
//TODO : Now using a different file for this, can probably delete
//IMPORTANT TODO:  CHANGE THIS SESSION SECRET FOR A PRODUCTION SERVER
// app.use(cookieParser())
// app.use(session({ secret: 'friedbanana', resave: false, saveUninitialized: false }))

// Initialize Passport and restore authentication state, if any, from the
// session.
// setupPassport(app);

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/passport/auth-check');
app.use('/api', authCheckMiddleware);


// Routes =============================================================
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

//	¯\_(ツ)_/¯
app.get("/*", function(req, res) {
res.sendFile(__dirname + '/public/index.html')
})



// Syncing our sequelize models and then starting our express app

hobbyhookupdb.sequelize.sync().then(function() {
	sequelize_fixtures.loadFile('db/seed.json', models).then(function(){
        app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    	});
    });

});