var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var keys=require('./config/keys');
var session=require('express-session');
var flash=require('connect-flash');

var indexRouter = require('./routes/indexRoutes');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/authRoutes');
var profileRouter=require('./routes/profileRoutes');
var adminRouter=require('./routes/adminRoutes');
var requestRouter=require('./routes/requestRoutes');
var confirmRouter=require('./routes/confirmRoutes');



const passport=require('passport');
const cookieSession=require('cookie-session');
/////torun the passport setup.js file 
const passportSetup=require('./config/passport-setup');
//mongodb setup
const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
//connect to mongodb
mongoose.connect(keys.mongodb.dbURI).then(function(){
console.log('Database Connencted');
});





var app = express();


///setting up cookie session
app.use(cookieSession({
  maxAge:5*24*60*1000,//max lifetime in milliseconds
  keys:[keys.session.cookieKey] //to incerept seesion or cookie ids,we can pass any string here,r8 nw it's saved in keys file
}));




///we want passport to initialize first, then use session-cookies
//1st initialize passport
app.use(passport.initialize());
//2nd initialize session to control login
app.use(passport.session());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//session middleware

//session middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));


app.use(flash());
//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile',profileRouter);
app.use('/admin',adminRouter);
app.use('/requests',requestRouter);
app.use('/confirms',confirmRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
