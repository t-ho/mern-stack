const _ = require('lodash');
const defaultConfig = require('./config.default');

/**
 * Configuration for Production environment
 */
let prodConfig = {
  app: {
    name: 'mern', // TODO: Lowercase, URL compatible name
    title: 'MERN Stack' // TODO: Human friendly name
  },
  auth: {
    // require email verification when signing up
    // if false, the password reset functionality is also disabled.
    verifyEmail: true
  },
  email: {
    from: 'no-reply@mern.tdev.app', // TODO
    to: '',
    signature: 'The MERN Team' // TODO
  },
  mailgun: {
    domain: 'sandbox4f20bd7a5b3a451e99ad609946b1db5d.mailgun.org' // TODO:
  },
  jwt: {
    algorithm: 'HS512',
    expiresIn: 60 * 24 * 60 * 60 // seconds
  },
  server: {
    url: 'http://localhost' // TODO:
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`)
  },
  oauth: {
    storeToken: false // If true, the OAuth access_token and refresh_token will be stored in database
  },
  seed: {
    logging: true,
    users: [
      {
        username: 'root',
        email: 'root@tdev.app',
        password: 'password',
        firstName: 'Root',
        lastName: 'Account',
        role: 'root'
      },
      {
        username: 'admin',
        email: 'admin@tdev.app',
        password: 'password',
        firstName: 'Admin',
        lastName: 'Account',
        role: 'admin'
      }
    ]
  }
};

prodConfig = _.merge({}, defaultConfig, prodConfig);

module.exports = prodConfig;
