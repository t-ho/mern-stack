const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleIdTokenStrategy = require('passport-google-id-token');
const config = require('../config/index');

const User = mongoose.model('User');

// Create local strategy
const localStrategy = new LocalStrategy(
  {
    usernameField: 'usernameOrEmail',
    passwordField: 'password',
  },
  function (usernameOrEmail, password, done) {
    User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'Username or email does not exist',
          });
        }
        if (!user.provider.local) {
          // not a local account (email and password)
          return done(null, false, {
            message: 'Username or email does not exist',
          });
        }
        user.comparePasswordAsync(password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: 'Password is incorrect' });
          }

          if (config.auth.verifyEmail) {
            if (user.status === 'unverified-email') {
              return done(null, false, { message: 'Email is not verified' });
            }
          }

          if (user.status !== 'active') {
            return done(null, false, {
              message: 'Your account is disabled',
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
    secretOrKey: config.jwt.secret,
  },
  function (jwtPayload, done) {
    User.findById(jwtPayload.userId)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        if (user.subId !== jwtPayload.sub) {
          return done(null, false, { message: 'Invalid JWT token' });
        }

        if (user.status === 'disabled') {
          return done(null, false, { message: 'Disabled account' });
        }

        return done(null, user);
      })
      .catch(done);
  }
);

// Create Google Id Token Strategy
const googleIdTokenStrategy = new GoogleIdTokenStrategy(
  {
    clientID: config.oauth.google.clientId,
  },
  function ({ payload: profile }, googleId, done) {
    const userProfile = {
      provider: 'google',
      userId: googleId,
      email: profile.email,
      username: generateUsername(
        profile.email,
        profile.given_name,
        profile.family_name
      ),
      firstName: profile.given_name,
      lastName: profile.family_name,
      picture: profile.picture,
    };

    updateOrInsert(userProfile)
      .then((user) => {
        done(null, user);
      })
      .catch(done);
  }
);

// Create Google Token Strategy
const facebookTokenStrategy = new FacebookTokenStrategy(
  {
    clientID: config.oauth.facebook.clientId,
    clientSecret: config.oauth.facebook.clientSecret,
  },
  function (accessToken, refreshToken, profile, done) {
    const userProfile = {
      provider: 'facebook',
      userId: profile.id,
      email: profile._json.email,
      username: generateUsername(
        profile._json.email,
        profile._json.given_name,
        profile._json.family_name
      ),
      firstName: profile._json.first_name,
      lastName: profile._json.last_name,
      picture: profile.photos[0].value,
    };

    updateOrInsert(userProfile)
      .then((user) => {
        done(null, user);
      })
      .catch(done);
  }
);

/**
 * @function generateRandomNumber
 * Generate a random number between 1 and 99
 *
 * @returns {string}
 */
const generateRandomNumber = () => {
  const number = Math.floor(Math.random() * 99 + 1);
  return `00${number}`.slice(-2);
};

/**
 * Generate username based on email, or name
 *
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 *
 * @returns {string} the username
 */
const generateUsername = (email, firstName, lastName) => {
  let username = '';
  if (email) {
    username = email.split('@')[0];
  } else if (firstName && lastName) {
    username = `${firstName}${lastName}${generateRandomNumber()}`;
  }
  return username.toLowerCase();
};

/**
 * Find the unique username
 *
 * @param {string} possibleUsername The possible username
 */
const findUniqueUsername = (possibleUsername) => {
  return User.findOne({ username: possibleUsername }).then((existingUser) => {
    if (!existingUser) {
      return possibleUsername;
    }
    return `${possibleUsername}${generateRandomNumber()}`;
  });
};

/**
 * Update or insert an user
 *
 * @param {object} userProfile The user profile
 *
 * @returns {Promise} Resolve with the updated user or newly created user
 */
const updateOrInsert = (userProfile) => {
  let query = {
    $or: [
      { email: userProfile.email },
      {
        [`provider.${userProfile.provider}`]: {
          userId: userProfile.userId,
        },
      },
    ],
  };

  let provider = {
    userId: userProfile.userId,
    picture: userProfile.picture,
  };

  return User.findOne(query).then((existingUser) => {
    if (!existingUser) {
      return findUniqueUsername(userProfile.username).then(
        (availableUsername) => {
          let user = new User({
            email: userProfile.email,
            username: availableUsername,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            provider: {
              [userProfile.provider]: provider,
            },
          });
          user.setSubId();
          return user.save();
        }
      );
    }
    // user existed, update provider
    existingUser.provider[userProfile.provider] = provider;
    existingUser.firstName = userProfile.firstName;
    existingUser.lastName = userProfile.lastName;
    return existingUser.save();
  });
};

passport.use(facebookTokenStrategy);
passport.use(googleIdTokenStrategy);
passport.use(jwtStrategy);
passport.use(localStrategy);

module.exports = passport;
