const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const monconfig = require('./config/mongo');
const modeluser = require('./model/usermodel');
const authentication = require('./auth')


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.use('/mongo', monconfig);
app.use('/usermodel', modeluser);
app.use(cookieParser());
app.use('/auth', authentication)


app.get('/login', (req, res) => {
  // Access cookies using req.cookies
  const username = req.cookies.username;
  res.send(`Hello, ${username || 'Guest'}!`);
});

app.use(function (err, req, res, next) {
  // Handle errors here
  console.error(err);
  res.status(err.status || 500).send('Something went wrong');
});

module.exports = app;

