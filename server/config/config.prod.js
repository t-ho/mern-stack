const fspath = require('path');
const _ = require('lodash');
const defaultConfig = require('./config.default');

/**
 * Configuration for Production environment
 */
let prodConfig = {
  app: {
    name: 'mern', // TODO: Lowercase, URL compatible name
    title: 'MERN Stack', // TODO: Human friendly name
  },
  auth: {
    verifyEmail: false, // If true, require email verification when signing up
    resetPassword: true, // If true, be able to reset password via email
  },
  cors: {
    enabled: false,
  },
  email: {
    from: 'no-reply@mern.tdev.app', // TODO
    to: '',
    signature: 'The MERN Team', // TODO
  },
  jwt: {
    algorithm: 'HS512',
    expiresIn: 60 * 24 * 60 * 60, // seconds
  },
  morgan: {
    enabled: true,
    format: 'combined', // TODO: possible values: combined, common, dev, short, tiny
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`),
  },
  oauth: {
    storeTokens: false, // If true, the OAuth accessToken and refreshToken will be stored in database
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
        role: 'root',
      },
      {
        username: 'admin',
        email: 'admin@tdev.app',
        password: 'qweasdzxc',
        firstName: 'Admin',
        lastName: 'Account',
        role: 'admin',
      },
    ],
  },
};

prodConfig = _.merge({}, defaultConfig, prodConfig);

module.exports = prodConfig;
