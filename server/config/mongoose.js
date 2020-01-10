const mongoose = require('mongoose');
const config = require('./index');

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true); // FIXME: fix deprecation warnings
mongoose.set('useNewUrlParser', true); // FIXME: fix deprecation warnings
mongoose.set('useUnifiedTopology', true); // FIXME: fix deprecation warnings

mongoose.connect(config.mongo.uri);

mongoose.connection.on('error', () => {
  console.log('[-] Unable to connect to Mongo instance');
});

require('../models');
