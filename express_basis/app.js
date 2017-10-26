var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// 配置session()
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  resave: false,
  saveUninitialized: true
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express)
app.set('view engine', 'html');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 登录以后，将user对象存入session，再交给response对象，用于页面显示

app.use((req, res, next) => {
  res.locals.user = req.session.user
  let err = req.session.error
  delete req.session.error
  res.locals.message = ''
  if (err) {
    res.locals.message = `<div class="alert alert-danger">${err}</div>`
  }
  next()
})
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
