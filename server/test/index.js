const mongoose = require('mongoose');

before(function(done) {
  // Load the app server
  require('../index');

  // connect to the test database
  mongoose.connect('mongodb://localhost/mern_test');

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
  const User = mongoose.model('User');
  const user = new User({
    username: 'admin',
    email: 'admin@mern-stack.org',
    password: 'password',
    firstName: 'Admin',
    lastName: 'Local',
    role: 'admin'
  });
  user
    .setPasswordAsync('password')
    .then(() => user.save())
    .then(user => {
      app.test = {
        data: {
          admin: user
        }
      };
      done();
    })
    .catch(done);
});
