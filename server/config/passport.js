const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./index');

const User = mongoose.model('User');

// Create local strategy
const localStrategy = new LocalStrategy(
  {
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  },
  function(usernameOrEmail, password, done) {
    User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Invalid username or email' });
        }
        user.comparePasswordAsync(password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
          }

          if (config.auth.verifyEmail) {
            if (user.status === 'unverifiedEmail') {
              return done(null, false, { message: 'Unverified email' });
            }
          }

          return done(null, user);
        });
      })
      .catch(done);
  }
);

// Create JWT Strategy
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
  },
  function(jwtPayload, done) {
    User.findById(jwtPayload.userId)
      .then(user => {
        if (!user) return done(null, false, 'Invalid credentials');
        return done(null, user);
      })
      .catch(done);
  }
);

passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = passport;
