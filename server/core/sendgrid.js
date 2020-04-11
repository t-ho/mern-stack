const Email = require('sendgrid-template-helper');
const config = require('../config');

const email = new Email({
  apiKey: config.sendgrid.apiKey,
  prefix: `${config.app.name}_`,
});

module.exports = email;
