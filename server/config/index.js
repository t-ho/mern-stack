const fspath = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');

dotenv.config({ path: fspath.resolve(__dirname, '../../.env') });

let config = {
  env: process.env.NODE_ENV,
  app: {
    name: 'mern', // TODO: Lowercase, URL compatible name
    title: 'MERN Stack' // TODO: Human friendly name
  },
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
  },
  seed: {
    logging: true,
    users: [
      {
        username: 'root',
        email: 'root@mern-stack.org',
        password: 'password',
        firstName: 'Root',
        lastName: 'Account',
        role: 'root'
      },
      {
        username: 'admin',
        email: 'admin@mern-stack.org',
        password: 'password',
        firstName: 'Admin',
        lastName: 'Account',
        role: 'admin'
      },
      {
        username: 'user',
        email: 'user@mern-stack.org',
        password: 'password',
        firstName: 'User',
        lastName: 'Account',
        role: 'user'
      }
    ]
  }
};

if (config.env === 'test') {
  config.seed.logging = false;
  config.mongo.uri = `mongodb://localhost/${config.app.name}_test`;
  config.server.port = 7357; // 7357 = TEST
}

module.exports = config;
