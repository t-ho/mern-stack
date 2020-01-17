const fs = require('fs');
const fspath = require('path');
const nodemailer = require('nodemailer');
const nodemailerMailgun = require('nodemailer-mailgun-transport');
const Handlebars = require('handlebars');
const createError = require('http-errors');
const _ = require('lodash');
const config = require('./index');

const transporter = nodemailer.createTransport(
  nodemailerMailgun({
    auth: {
      api_key: config.mailgun.apiKey,
      domain: config.mailgun.domain
    }
  })
);

const defaultOptions = {
  from: config.email.from,
  to: config.email.to,
  subject: ''
};

/**
 * Send an email.
 * @param {object} options - The mail options
 *
 * @param {string} [options.template] File on disk to use to load the email template.
 * @param {object} [options.templateParams] Object containing any dynamic parameters to be passed to the handlebars template specified in template
 * @param {string} [options.html] HTML payload of the email
 * @param {srting} [options.text] Plain text payload of the email
 * @param {string} [options.from] The from portion of the email
 * @param {string} [options.to] The to portion of the email
 * @param {string} [options.subject] The subject portion of the email
 * @param {string} [options.cc] The cc portion of the email
 * @param {string} [options.bcc] The bcc portion of the email
 * @return {Promise} A promise representing the status of the email being sent, resolve is called with the returned object from the nodemailer transporter
 */
const sendMail = function(options) {
  if (_.isObject(options)) {
    options = _.merge({}, defaultOptions, options);
  } else {
    options = _.merge({}, defaultOptions);
  }

  options.subject = Handlebars.compile(options.subject)(options.templateParams);

  if (options.template) {
    const template = fs.readFileSync(options.template, 'utf-8');
    const extension = fspath.parse(options.template).ext;
    if (extension === '.html') {
      options.html = Handlebars.compile(template)(options.templateParams);
    } else if (extension === '.txt') {
      options.text = Handlebars.compile(template)(options.templateParams);
    } else {
      throw new Error(
        `Unable to process template file "${options.template}". Please use *.txt or *.html extension`
      );
    }
  } else {
    if (!options.html && !options.text) {
      throw new Error(
        'Email content is required. Please specify via options.template, options.html or options.text'
      );
    }
  }

  delete options.template;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      transporter.sendMail(options, (err, res) => {
        if (err) {
          if (err.message === 'Forbidden') {
            reject(createError(500, '[Mailgun] Invalid API key'));
          } else if (err.message.includes('Domain not found')) {
            reject(createError(500, '[Mailgun] Invalid domain'));
          }
          return reject(err);
        }
        resolve(res);
      });
    });
  });
};

module.exports = sendMail;
