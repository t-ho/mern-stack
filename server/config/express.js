const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const createError = require('http-errors');
const routes = require('../routes');
const passport = require('./passport');
const config = require('./index');

// App Setup
const app = express();

if (config.env !== 'production') {
  // Enable logger
  app.use(morgan('dev'));
}

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

// Serve static assets in production mode
if (config.env === 'production') {
  const buildDir = path.resolve(__dirname, '../../client/build');
  if (!fs.existsSync(buildDir)) {
    throw new Error(
      `The production build directory "${buildDir}" does not exist`
    );
  }
  app.use(express.static(buildDir));
  app.get('*', (req, res) => {
    res.sendFile(`${buildDir}/index.html`);
  });
}

// catch 404 errors and forward to error handler
app.use((req, res, next) => next(createError(404, 'Not Found')));

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 400).send({ error: err.message });

  // Only print stacktrace during development
  // by passing error to built-in error handler
  next(err);
});

module.exports = app;
