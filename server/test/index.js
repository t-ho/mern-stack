const mongoose = require('mongoose');
const chalk = require('chalk');
const seed = require('../config/seed');
const config = require('../config');

const users = [
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
];

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
