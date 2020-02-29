const _ = require('lodash');
const defaultConfig = require('./config.default');

/**
 * Configuration for development environment
 */
let devConfig = {
  auth: {
    // require email verification when signing up
    // if false, the password reset functionality is also disabled.
    verifyEmail: false
  },
  mailgun: {
    domain: 'sandbox4f20bd7a5b3a451e99ad609946b1db5d.mailgun.org' // TODO:
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
      },
      {
        username: 'user',
        email: 'user@tdev.app',
        password: 'password',
        firstName: 'User',
        lastName: 'Account',
        role: 'user'
      }
    ]
  }
};

devConfig = _.merge({}, defaultConfig, devConfig);

module.exports = devConfig;
