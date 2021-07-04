const fspath = require('path');
const _ = require('lodash');
const defaultConfig = require('./config.default');
const constants = require('../core/constants');

/**
 * Configuration for Production environment
 */
let prodConfig = {
  app: {
    name: 'mern', // TODO: Lowercase, URL compatible name
    title: 'MERN Stack', // TODO: Human friendly name
  },
  auth: {
    appleSignIn: true,
    facebookSignIn: true,
    googleSignIn: true,
    resetPassword: true, // If true, be able to reset password via email
    verifyEmail: true, // If true, require email verification when signing up
  },
  cors: {
    enabled: false,
  },
  email: {
    from: 'no-reply@mernstack.tdev.app', // TODO
    to: '',
    signature: 'The MERN Team', // TODO
  },
  jwt: {
    algorithm: 'HS512',
    expiresIn: 60 * 24 * 60 * 60, // seconds
  },
  morgan: {
    enabled: true,
    format: constants.MORGAN_FORMAT_COMBINED, // TODO: possible values: combined, common, dev, short, tiny
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`),
  },
  oauth: {},
  rateLimit: {
    enabled: true,
  },
  seed: {
    logging: true,
    users: [
      {
        username: 'root',
        email: 'root@tdev.app',
        password: 'qweasdzxc',
        firstName: 'Root',
        lastName: 'Account',
        role: constants.ROLE_ROOT,
      },
      {
        username: 'admin',
        email: 'admin@tdev.app',
        password: 'qweasdzxc',
        firstName: 'Admin',
        lastName: 'Account',
        role: constants.ROLE_ADMIN,
      },
    ],
  },
  trustProxy: {
    enabled: true,
    // see https://expressjs.com/en/guide/behind-proxies.html
    value: 1,
  },
};

prodConfig = _.merge({}, defaultConfig, prodConfig);

module.exports = prodConfig;
