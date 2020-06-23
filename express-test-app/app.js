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
var credentialsClient = Client.create({
  clientType: "client_credentials" ,
  clientDetails: {  
    clientId: '26519543-2A32-4E1D-AED2-5D9C9D2C75A2',
    clientSecret: '9b54164a068e4e5aabed39cd85424916-1ca4bd0348c64312978f4a82a0d83660-259db795f43a48a29574793deadc81d6'
  },
  projectId: 'website',
  rootUrl: 'https://localhost:44314'
});

var passwordClient = Client.create({
  clientType: "password",
  clientDetails: {
    username: 'admin',
    password: 'Password99',
    clientId: '3b05c541-c4b3-4f14-b2e8-61b194152f33',
  },
  projectId: 'website',
  rootUrl: 'https://localhost:44314'
});

let tokenClient = Client.create({
  clientType: "token",
  clientDetails: {
    tokenValue: "dbc864f3-12b8-4e28-8a7e-cdc48f2fc6f7",
  },
  projectId: 'website',
  rootUrl: 'https://localhost:44314'
});

// var client = Client.create({
//   clientId: 'c259d129-4268-4196-97f6-5cf4be79b6c9',
//   clientSecret: '3797af99d7a9485885cf24d92d44c347-856d1c70decd44d68b20bf0131e1738e-333742834ccb43b08bd4d6535231db7b',
//   projectId: 'website',
//   rootUrl: 'https://cms-12.cloud.contensis.com'
// });

// var client = Client.create({
//   clientId: '479fcaf9-8636-4948-9693-ef657ab053ec',
//   clientSecret: '5fd72a8a913b4469bf9ce5284825a8fc-836329b5d9fc42628b523575f53730fc-ae45f04ad41349638b55ca538d10ba75',
//   projectId: 'contensisWebsite',
//   rootUrl: 'https://cms-master.cloud.contensis.com'
// });

// var client = Client.create({
//   clientId: '488fbf92-eaac-43f6-be1e-d4b572b2df11',
//   clientSecret: '89c8e00281da40118c877927cf223cb4-204a54f1a75f4595b3822835e73d57e6-6f0bc3bb683e4f9f949d85860d9a8cdf',
//   projectId: 'website',
//   rootUrl: 'https://cms-develop.cloud.contensis.com'
// });

app.set('client', credentialsClient);
app.set('tokenClient', tokenClient);
app.set('passwordClient', passwordClient);

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
