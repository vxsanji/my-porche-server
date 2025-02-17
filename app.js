var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config()

var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tradesRouter = require('./routes/trades');
var marketRouter = require('./routes/market');
var balanceRouter = require('./routes/balance');
var accountsRouter = require('./routes/accounts');
const authenticateJWT = require('./middleware/auth');

var app = express();

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("🔥 Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}))
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', authenticateJWT, usersRouter);
app.use('/api/trade', authenticateJWT, tradesRouter);
app.use('/api/market', authenticateJWT, marketRouter);
app.use('/api/balance', authenticateJWT, balanceRouter);
app.use('/api/accounts', authenticateJWT, accountsRouter);
app.use('/api/auth', authRouter)

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
