let express = require('express');
let config = require('./config');
let mongoose = require('./lib/mongoose');
let session = require('express-session');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let login = require('./routes/login');
let signup = require('./routes/signup');
let recovery = require('./routes/recovery');
let updateUserPassword = require('./routes/updateUserPassword');
let logout = require('./routes/logout');
let checkUser = require('./routes/checkUser');
let checkAuthUser = require('./routes/checkAuthUser');
let getUser = require('./routes/getUser');
let incomes = require('./routes/incomes');
let expenses = require('./routes/expenses');
let statistics = require('./routes/statistics');
let tags = require('./routes/tags');

let app = express();

app.use(express.static('public'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

let MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session.key'),
  cookie: config.get('session.cookie'),
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: true,
  saveUninitialized: true
}));

// Routers
// auth routes
app.use('/login', login);
app.use('/signup', signup);
app.use('/recovery', recovery);
app.use('/logout', logout);
app.use('/checkUser', checkUser);
app.use('/checkAuthUser', checkAuthUser);
app.use('/getUser', getUser);
app.use('/updateUserPassword', updateUserPassword);
// income route
app.use('/incomes', incomes);
app.use('/expenses', expenses);
app.use('/statistics', statistics);
app.use('/tags', tags);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
  console.log(err);
  res.send({error: err});
});

module.exports = app;
