const fspath = require('path');

module.exports = {
  title: 'MERN',
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
    secret: '[Your-Secret-Token]' // FIXME:
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
