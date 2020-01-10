const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('../routes');

const app = express();

// App Setup
app.use(morgan('dev'));

// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Support parsing of */* type post data
app.use(bodyParser.json({ type: '*/*' }));

app.use(routes);

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message });

  // Only print stacktrace during development
  // by passing error to built-in error handler
  next(err);
});

module.exports = app;
