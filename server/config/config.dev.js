const _ = require('lodash');
const defaultConfig = require('./config.default');
const constants = require('../core/constants');

/**
 * Configuration for development environment
 */
let devConfig = {
  auth: {
    appleSignIn: false,
    facebookSignIn: false,
    googleSignIn: false,
    resetPassword: false, // If true, be able to reset password via email
    verifyEmail: false, // If true, require email verification when signing up
  },
  morgan: {
    format: constants.MORGAN_FORMAT_DEV, // TODO: possible values: combined, common, dev, short, tiny
  },
  oauth: {},
  seed: {
    logging: true,
    users: [
      {
        username: 'root',
        email: 'root@tdev.app',
        password: 'password',
        firstName: 'Root',
        lastName: 'Account',
        role: constants.ROLE_ROOT,
      },
      {
        username: 'admin',
        email: 'admin@tdev.app',
        password: 'password',
        firstName: 'Admin',
        lastName: 'Account',
        role: constants.ROLE_ADMIN,
      },
      {
        username: 'user',
        email: 'user@tdev.app',
        password: 'password',
        firstName: 'User',
        lastName: 'Account',
        role: constants.ROLE_USER,
      },
    ],
  },
};

devConfig = _.merge({}, defaultConfig, devConfig);

module.exports = devConfig;
