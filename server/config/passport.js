const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./index');

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

// Create JWT Strategy
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
  },
  function(jwtPayload, done) {
    User.findById(jwtPayload.sub)
      .then(user => {
        if (!user) return done(null, false);
        user.hashedPassword = undefined;
        return done(null, user);
      })
      .catch(done);
  }
);

passport.use(localStrategy);
passport.use(jwtStrategy);

module.exports = passport;
