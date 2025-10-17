var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let expressLayouts = require('express-ejs-layouts');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let packagesRouter = require('./routes/packages');
const Swal = require('sweetalert2');
const flash = require('connect-flash');
const session = require('express-session');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main'); // Layout por defecto

// Middleware (¡SIN esto no funciona!)
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sesión y Flash
app.use(session({
  secret: 'clave_secreta_segura',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// 🔹 Middleware GLOBAL (esto es lo importante)
app.use((req, res, next) => {
  res.locals.success = req.flash('success') || [];
  res.locals.error = req.flash('error') || [];
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/packages', packagesRouter);

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
