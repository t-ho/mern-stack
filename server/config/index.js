const fspath = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
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
    apiKey: process.env.MAILGUN_API_KEY, // FIXME: edit .env file
    domain: 'sandbox4f20bd7a5b3a451e99ad609946b1db5d.mailgun.org' // FIXME:
  },
  jwt: {
    algorithm: 'HS512',
    secret: process.env.JWT_SECRET,
    expiresIn: 60 * 24 * 60 * 60 // seconds
  },
  mongo: {
    uri: process.env.MONGO_URI // FIXME: edit .env file
  },
  server: {
    port: process.env.SERVER_PORT, // FIXME: edit .env file
    url: 'http://localhost' // FIXME:
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`)
  }
};
