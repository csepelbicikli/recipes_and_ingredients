var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');
var recipeCollection = require('./models/recipe');
var userCollection = require('./models/user');
var ingredientCollection = require('./models/ingredient');

var indexRouter = require('./controllers/index');
var recipeRouter = require('./controllers/recipes');
var loginRouter = require('./controllers/login');
var operatorRouter = require('./controllers/operator');
var ingredientRouter = require('./controllers/ingredients');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'nickname',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, nickname, password, done) {
        req.app.models.user.findOne({ nickname : nickname }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező nickname.' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })
        });
    }
));

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'nickname',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, nickname, password, done) {
        req.app.models.user.findOne({ nickname: nickname }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));

// Middleware segédfüggvény
function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}
function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
}

// express app
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 120000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(setLocalsForLayout());

//endpoint
app.use('/', indexRouter);
//app.use('/errors', errorRouter);
app.use('/recipes', ensureAuthenticated, recipeRouter);
app.use('/login', loginRouter);
app.use('/operator',ensureAuthenticated,operatorRouter);
app.use('/ingredients',ensureAuthenticated,ingredientRouter);
/*app.get('/operator', ensureAuthenticated, andRestrictTo('operator'), function(req, res) {
    res.end('operator');
});*/

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})



// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(ingredientCollection));
orm.loadCollection(Waterline.Collection.extend(recipeCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));

// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});