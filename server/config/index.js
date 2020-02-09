const fspath = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: fspath.resolve(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  appName: 'MERN',
  auth: {
    // require verify email when signing up
    verifyEmail: false // Note: If true, please specify your mailgun API key
  },
  email: {
    from: 'no-reply@mern.com', // TODO
    to: '',
    signature: 'The MERN Team' // TODO
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY, // TODO: edit .env file
    domain: 'sandbox4f20bd7a5b3a451e99ad609946b1db5d.mailgun.org' // TODO:
  },
  jwt: {
    algorithm: 'HS512',
    secret: process.env.JWT_SECRET,
    expiresIn: 60 * 24 * 60 * 60 // seconds
  },
  mongo: {
    uri: process.env.MONGO_URI // TODO: edit .env file
  },
  server: {
    port: process.env.SERVER_PORT, // TODO: edit .env file
    url: 'http://localhost' // TODO:
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`)
  }
};
