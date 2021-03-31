var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var nforce = require('nforce');
// create the connection with the salesforce connected app
var org = nforce.createConnection({
  clientId: 'YOUR-CLIENT-ID'
  clientSecret: 'YOUR-CLIENT-SECRET',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  apiVersion: 'v48.0',  // optional, defaults to current salesforce API version
  environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'single'
});

// authenticate and return oauth token
org.authenticate({
  username: 'YOUR-USERNAME',
  password: 'YOUR-PASSWORD'//+process.env.SECURITY_TOKEN
}, function(err, resp){
  if (!err) console.log('W00t! Logged into Salesforce successfully! Cached Token: ' + org.oauth.access_token);
  if (err) console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// home page
app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Trailhead Lightning Out!',
    lightningEndPointURI: process.env.LIGHTNING_URL,
    authToken: org.oauth.access_token
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// app.use(allowCrossDomain);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
