const mongoose = require('mongoose');
const config = require('../config');
const seed = require('./seed');
const constants = require('./constants');

require('../models');

mongoose.Promise = global.Promise;

if (config.env !== constants.ENV_TEST) {
  mongoose.connect(config.mongo.uri);
  mongoose.connection.once('open', () => {
    seed.createUsers(config.seed.users);
  });
} else {
  mongoose.connect(config.mongo.testUri);
}

mongoose.connection.on('error', () => {
  console.log('[-] Unable to connect to Mongo instance');
});
