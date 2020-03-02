const _ = require('lodash');
const defaultConfig = require('./config.default');

/**
 * Configuration for development environment
 */
let testConfig = {
  auth: {
    verifyEmail: false, // If true, require email verification when signing up
    resetPassword: false // If true, be able to reset password via email
  },
  mongo: {
    testUri: `mongodb://localhost:27017/${defaultConfig.app.name}_test`
  },
  server: {
    url: 'http://localhost' // TODO:
  },
  oauth: {
    storeToken: true // If true, the OAuth access_token and refresh_token will be stored in database
  },
  seed: {
    logging: false,
    users: [
      {
        username: 'root',
        email: 'root@tdev.app',
        password: 'password',
        firstName: 'Root',
        lastName: 'Account',
        role: 'root',
        provider: {
          google: {
            userId: 'google-user-id-01',
            picture: 'google-avatar-url',
            accessToken: 'google-access-token',
            refreshToken: 'google-refresh-token'
          },
          facebook: {
            userId: 'facebook-user-id-01',
            picture: 'facebook-avatar-url',
            accessToken: 'facebook-access-token',
            refreshToken: 'facebook-refresh-token'
          }
        }
      },
      {
        username: 'admin',
        email: 'admin@tdev.app',
        password: 'password',
        firstName: 'Admin',
        lastName: 'Account',
        role: 'admin',
        provider: {
          google: {
            userId: 'google-user-id-02',
            picture: 'google-avatar-url',
            accessToken: 'google-access-token',
            refreshToken: 'google-refresh-token'
          },
          facebook: {
            userId: 'facebook-user-id-02',
            picture: 'facebook-avatar-url',
            accessToken: 'facebook-access-token',
            refreshToken: 'facebook-refresh-token'
          }
        }
      },
      {
        username: 'user',
        email: 'user@tdev.app',
        password: 'password',
        firstName: 'User',
        lastName: 'Account',
        role: 'user',
        provider: {
          google: {
            userId: 'google-user-id-03',
            picture: 'google-avatar-url',
            accessToken: 'google-access-token',
            refreshToken: 'google-refresh-token'
          },
          facebook: {
            userId: 'facebook-user-id-03',
            picture: 'facebook-avatar-url',
            accessToken: 'facebook-access-token',
            refreshToken: 'facebook-refresh-token'
          }
        }
      }
    ]
  }
};

testConfig = _.merge({}, defaultConfig, testConfig);

module.exports = testConfig;
