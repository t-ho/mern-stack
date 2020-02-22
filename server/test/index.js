const mongoose = require('mongoose');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const config = require('../config');
const seed = require('../config/seed');

const users = [
  {
    username: 'root',
    email: 'root@tdev.app',
    password: 'password',
    firstName: 'Root',
    lastName: 'Account',
    role: 'root'
  },
  {
    username: 'admin',
    email: 'admin@tdev.app',
    password: 'password',
    firstName: 'Admin',
    lastName: 'Account',
    role: 'admin'
  },
  {
    username: 'user',
    email: 'user@tdev.app',
    password: 'password',
    firstName: 'User',
    lastName: 'Account',
    role: 'user'
  }
];

const generateJwtToken = user => {
  const iat = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    { sub: user.subId, userId: user._id, iat },
    config.jwt.secret,
    {
      algorithm: config.jwt.algorithm,
      expiresIn: config.jwt.expiresIn // seconds
    }
  );
  return token;
};

before(function(done) {
  if (config.env !== 'test') {
    throw new Error(
      chalk.red('[-] Test must be run in "test" environment (NODE_ENV=test)')
    );
  }
  // Load the app server
  require('../index');

  mongoose.connection.once('open', () => {
    done();
  });
});

beforeEach(function(done) {
  const User = mongoose.model('User');
  User.deleteMany({}).then(res => {
    done();
  });
});

beforeEach(function(done) {
  seed.createUsers(users).then(users => {
    app.locals.existing = {};
    users.forEach(user => {
      user.jwtToken = generateJwtToken(user);
      app.locals.existing[[user.role]] = user;
    });
    done();
  });
});

after(function(done) {
  mongoose.connection.db.dropDatabase(function(err, result) {
    done();
  });
});
