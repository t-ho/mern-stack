const fspath = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const chalk = require('chalk');

dotenv.config({ path: fspath.resolve(__dirname, '../../.env') });

/**
 * Joi schema for validating environment variables
 */
const envVarsSchema = Joi.object({
  FACEBOOK_APP_ID: Joi.string().required(),
  FACEBOOK_APP_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MONGO_URI: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  SERVER_HOST: Joi.string().required(),
  SERVER_PORT: Joi.number().required(),
  SERVER_PUBLIC_URL: Joi.string().uri().required(),
  SENDGRID_API_KEY: Joi.string(),
}).unknown();

const { value, error } = envVarsSchema.validate(process.env);
if (error) {
  console.log(
    chalk.red(
      '\n[-] Invalid environment variables. Please edit the ".env" file and restart the process.'
    )
  );
  throw new Error(error.message);
}

let envConfig = {
  env: value.NODE_ENV,
  jwt: {
    secret: value.JWT_SECRET,
  },
  mongo: {
    uri: value.MONGO_URI,
  },
  sendgrid: {
    apiKey: value.SENDGRID_API_KEY,
  },
  server: {
    host: value.SERVER_HOST,
    port: value.SERVER_PORT,
    publicUrl: value.SERVER_PUBLIC_URL,
  },
  oauth: {
    facebook: {
      clientId: value.FACEBOOK_APP_ID,
      clientSecret: value.FACEBOOK_APP_SECRET,
    },
    google: {
      clientId: value.GOOGLE_CLIENT_ID,
      clientSecret: value.GOOGLE_CLIENT_SECRET,
    },
  },
};

let config = {};

if (envConfig.env === 'development') {
  config = require('./config.dev');
} else if (envConfig.env === 'production') {
  config = require('./config.prod');
} else if (envConfig.env === 'test') {
  config = require('./config.test');
}

config = _.merge({}, config, envConfig);

module.exports = config;
