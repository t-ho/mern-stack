const fspath = require('path');

/**
 * Default configuration
 */
let defaultConfig = {
  app: {
    name: 'mern', // TODO: Lowercase, URL compatible name
    title: 'MERN Stack' // TODO: Human friendly name
  },
  auth: {
    verifyEmail: false, // If true, require email verification when signing up
    resetPassword: false // If true, be able to reset password via email
  },
  email: {
    from: 'no-reply@tdev.app', // TODO
    to: '',
    signature: 'The MERN Team' // TODO
  },
  jwt: {
    secret: 'This will be overriden by environment variable JWT_SECRET',
    algorithm: 'HS512',
    expiresIn: 60 * 24 * 60 * 60 // seconds
  },
  mongo: {
    uri: 'This will be overriden by environment variable MONGO_URI',
    testUri: 'mongodb://localhost:27017/mern_test'
  },
  sendgrid: {
    apiKey: 'This will be overriden by environment variable SENDGRID_API_KEY'
  },
  server: {
    port: 'This will be overriden by environment variable SERVER_PORT',
    url: 'http://localhost' // TODO:
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`)
  },
  oauth: {
    storeToken: false, // If true, the OAuth access_token and refresh_token will be stored in database
    google: {
      clientId:
        'This will be overriden by environment variable GOOGLE_CLIENT_ID',
      clientSecret:
        'This will be overriden by environment variable GOOGLE_CLIENT_SECRET'
    },
    facebook: {
      clientId:
        'This will be overriden by environment variable FACEBOOK_APP_ID',
      clientSecret:
        'This will be overriden by environment variable FACEBOOK_APP_SECRET'
    }
  },
  seed: {
    logging: true,
    users: []
  }
};

module.exports = defaultConfig;
