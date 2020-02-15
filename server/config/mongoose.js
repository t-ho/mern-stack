const mongoose = require('mongoose');
const config = require('./index');
const seed = require('./seed');

require('../models');

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true); // FIXME: fix deprecation warnings
mongoose.set('useNewUrlParser', true); // FIXME: fix deprecation warnings
mongoose.set('useUnifiedTopology', true); // FIXME: fix deprecation warnings

mongoose.connect(config.mongo.uri);

// In test environment, use different seed
if (config.env !== 'test') {
  mongoose.connection.once('open', () => {
    seed.createUsers(config.seed.users);
  });
}

mongoose.connection.on('error', () => {
  console.log('[-] Unable to connect to Mongo instance');
});
