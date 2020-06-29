var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Client = require('contensis-management-api').Client;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var indexRouter = require('./routes/index');
var contentTypesRouter = require('./routes/contentTypes');
var entriesRouter = require('./routes/entries');

var app = express();

//Contensis client setup

var client = Client.create({
  clientType: "client_credentials" ,
  clientDetails: {  
    clientId: '26519567-2A32-4E1D-AED2-5D9C9D2C75A2',
    clientSecret: '9b54190a068e4e5aabed39cd85424916-1ca4bd0348c64312978f4a82a0d83660-259db795f43a48a29574793deadc81d6'
  },
  projectId: 'website',
  rootUrl: 'https://localhost:44314'
});

app.set('client', client);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set routes
app.use('/', indexRouter);
app.use('/contenttypes', contentTypesRouter);
app.use('/entries', entriesRouter);

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
  res.render('error');
});

module.exports = app;
