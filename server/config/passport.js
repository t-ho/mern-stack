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
          return done(null, false, {
            message: 'Username or email does not exist.'
          });
        }
        user.comparePasswordAsync(password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Password is incorrect.' });
          }

          if (config.auth.verifyEmail) {
            if (user.status === 'unverifiedEmail') {
              return done(null, false, { message: 'Email is not verified.' });
            }
          }

          if (user.status === 'disabled') {
            return done(null, false, {
              message: 'Your account is disabled.'
            });
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
        if (!user) {
          return done(null, false, 'Invalid credentials');
        }
        if (user.status === 'disabled') {
          return done(null, false, 'Disabled account');
        }
        return done(null, user);
      })
      .catch(done);
  }
);

passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = passport;
