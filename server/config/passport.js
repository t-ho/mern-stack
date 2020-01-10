const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

// Create local strategy
const localStrategy = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  function(email, password, done) {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false);
        user.comparePassword(password).then(isMatch => {
          if (!isMatch) return done(null, false);
          user.hashedPassword = undefined;
          return done(null, user);
        });
      })
      .catch(done);
  }
);

passport.use(localStrategy);

module.exports = passport;
