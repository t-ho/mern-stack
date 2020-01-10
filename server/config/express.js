const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('../routes');
const passport = require('./passport');

// App Setup
const app = express();

// Enable logger
app.use(morgan('dev'));

// Compress all responses
app.use(compression());

// Secure app by setting various HTTP headers
app.use(helmet());

// Enable Cross-Origin-Resource-Sharing
app.use(cors());

// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Support parsing of */* type post data
app.use(bodyParser.json({ type: '*/*' }));

app.use(passport.initialize());

app.use(routes);

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message });

  // Only print stacktrace during development
  // by passing error to built-in error handler
  next(err);
});

module.exports = app;
