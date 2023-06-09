// Imports
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var User = require('./models/user');
var UserController = require('./controllers/user')
var usersRouter = require('./routes/users');
require('dotenv').config();

// DB config
mongoose.connect('mongodb://127.0.0.1/ProjetoEW', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function () { console.log("Conexão ao MongoDB realizada com sucesso...") });

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.AUTHENTICATION_URL}/users/facebook/callback`
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOne({ providerId: profile.id, provider: 'facebook' }, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (user) {
        // Utilizador já existe, devolve o utilizador existente
        return cb(null, user);
      } else {
        // O utilizador não existe, cria um novo utilizador com as informações do Facebook
        const email = profile.emails ? profile.emails[0].value : ''; // Extrai o primeiro email, se disponível
        const username = profile.displayName || email || ''; // Utiliza o username, se disponível, caso contrário usa o email ou uma string vazia
        const newUser = new User({
          providerId: profile.id,
          provider: 'facebook',
          username: username, 
          name: profile.displayName,
          email: email, 
          level: 'consumer',
          active: true, 
          dateCreated: new Date().toISOString().substring(0, 19),
          dateLastAccess: new Date().toISOString().substring(0, 19)
        });
        
        UserController.addUser(newUser);
      }
    });
  }
));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.session());
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.jsonp({ error: err.message });
});

module.exports = app;
