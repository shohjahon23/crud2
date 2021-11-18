const createError = require('http-errors');
const express = require('express');
const mongoose = require("mongoose")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport")
const session = require('express-session')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const addRouter = require('./routes/add');
const registerRouter = require('./routes/register');
const app = express();

app.use(require('connect-flash')())
app.use(function (req , res , next) {
  res.locals.messages = require('express-messages')(req , res)
  next()
})

app.use(session({
  secret: 'secretApiKey',
  resave: true,
  saveUninitialized: true,
}))

mongoose.connect('mongodb://localhost:27017/deploy' , {useNewUrlParser : true , useUnifiedTopology: true });

const db = mongoose.connection
db.on('open' , () => {
  console.log(`MongoDb running`);
})
 
db.on('error' , (err) => {
  console.log(`MongoDb ERROR running` , err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/add/product' , express.static(path.join(__dirname, 'public')) )
require("./middlware/passport")(passport)
app.use(passport.initialize());
app.use(passport.session());

app.get('*' , (req , res , next) => {
  res.locals.user = req.user || null
  next()
})

app.use('/', indexRouter);
app.use('/add', addRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
