const fspath = require('path');

module.exports = {
  appName: 'MERN',
  auth: {
    // require verify email when signing up
    verifyEmail: true // Note: If true, please specify your mailgun API key
  },
  email: {
    from: 'no-reply@mern.com', // FIXME
    to: '',
    signature: 'The MERN Team' // FIXME
  },
  mailgun: {
    apiKey: 'key-[Your-Mailgun-API-key]', // FIXME:
    domain: 'mail.[your-domain].com' // FIXME:
  },
  jwt: {
    algorithm: 'HS512',
    secret: '[Your-Secret-Token]', // FIXME:
    expiresIn: 60 * 24 * 60 * 60 // seconds
  },
  mongo: {
    uri: 'mongodb://localhost/mern' // FIXME:
  },
  server: {
    port: process.env.PORT || 8080,
    url: 'http://localhost'
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`)
  }
};
