const fspath = require('path');
const constants = require('../core/constants');

/**
 * Default configuration
 */
let defaultConfig = {
  allowCreatorModify: {
    user: false, // Model name in camel case
    // examplePost: true
  },
  app: {
    name: 'mern', // TODO: Lowercase, URL compatible name
    title: 'MERN Stack', // TODO: Human friendly name
  },
  apple: {
    clientId: 'This will be overriden by environment variable APPLE_CLIENT_ID',
    teamId: 'This will be overriden by environment variable APPLE_TEAM_ID',
    keyId: 'This will be overriden by environment variable APPLE_KEY_ID',
    privateKey:
      'This will be overriden by environment variable APPLE_PRIVATE_KEY',
  },
  auth: {
    appleSignIn: false,
    facebookSignIn: false,
    googleSignIn: false,
    resetPassword: false, // If true, be able to reset password via email
    verifyEmail: false, // If true, require email verification when signing up
  },
  compression: {
    enabled: false,
    options: null, // See https://www.npmjs.com/package/compression
  },
  cors: {
    enabled: true,
    options: null, // See https://www.npmjs.com/package/cors
  },
  email: {
    from: 'no-reply@mernstack.tdev.app', // TODO
    to: '',
    signature: 'The MERN Team', // TODO
  },
  jwt: {
    secret: 'This will be overriden by environment variable JWT_SECRET',
    algorithm: 'HS512',
    expiresIn: 60 * 24 * 60 * 60, // seconds
  },
  helmet: {
    enabled: true,
    options: {}, // See https://www.npmjs.com/package/helmet
  },
  morgan: {
    enabled: true,
    format: constants.MORGAN_FORMAT_DEV, // TODO: possible values: combined, common, dev, short, tiny
    options: null, // See https://www.npmjs.com/package/morgan
  },
  mongo: {
    uri: 'This will be overriden by environment variable MONGO_URI',
    testUri: 'mongodb://localhost:27017/mern_test',
  },
  oauth: {
    google: {
      clientId:
        'This will be overriden by environment variable GOOGLE_CLIENT_ID',
      clientSecret:
        'This will be overriden by environment variable GOOGLE_CLIENT_SECRET',
    },
    facebook: {
      clientId:
        'This will be overriden by environment variable FACEBOOK_APP_ID',
      clientSecret:
        'This will be overriden by environment variable FACEBOOK_APP_SECRET',
    },
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`),
  },
  rateLimit: {
    enabled: false,
  },
  seed: {
    logging: true,
    users: [],
  },
  sendgrid: {
    apiKey: 'This will be overriden by environment variable SENDGRID_API_KEY',
  },
  server: {
    host: 'This will be overriden by environment variable SERVER_HOST',
    port: 'This will be overriden by environment variable SERVER_PORT',
    publicUrl:
      'This will be overriden by environment variable SERVER_PUBLIC_URL',
  },
  trustProxy: {
    enabled: false,
    // see https://expressjs.com/en/guide/behind-proxies.html
    value: 0,
  },
};

module.exports = defaultConfig;
