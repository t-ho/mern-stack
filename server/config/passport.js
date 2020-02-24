const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
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

          if (user.status !== 'active') {
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

        if (user.status !== 'active') {
          return done(null, false, 'Disabled or unverified account');
        }

        if (user.subId !== jwtPayload.sub) {
          return done(null, false, 'Invalid credentials');
        }

        return done(null, user);
      })
      .catch(done);
  }
);

// Create Google Token Strategy
const googleTokenStrategy = new GoogleTokenStrategy(
  {
    clientID: config.oauth.google.clientId,
    clientSecret: config.oauth.google.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    const userProfile = {
      provider: 'google',
      userId: profile.id,
      email: profile._json.email,
      username: generateUsername(
        profile._json.email,
        profile._json.given_name,
        profile._json.family_name
      ),
      verifiedEmail: profile._json.verified_email,
      firstName: profile._json.given_name,
      lastName: profile._json.family_name,
      picture: profile._json.picture,
      accessToken,
      refreshToken
    };

    updateOrInsert(userProfile)
      .then(user => {
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
const findUniqueUsername = possibleUsername => {
  return User.findOne({ username: possibleUsername }).then(existingUser => {
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
const updateOrInsert = userProfile => {
  let query = {
    $or: [
      { email: userProfile.email },
      {
        providers: {
          $elemMatch: {
            name: userProfile.provider,
            userId: userProfile.userId
          }
        }
      }
    ]
  };

  let provider = {
    name: userProfile.provider,
    userId: userProfile.userId,
    picture: userProfile.picture
  };
  if (config.oauth.storeToken) {
    provider.accessToken = userProfile.accessToken;
    provider.refreshToken = userProfile.refreshToken;
  }

  return User.findOne(query).then(existingUser => {
    if (!existingUser) {
      return findUniqueUsername(userProfile.username).then(
        availableUsername => {
          let user = new User({
            email: userProfile.email,
            username: availableUsername,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            providers: [provider]
          });
          user.setSubId();
          return user.save();
        }
      );
    }
    // user existed, update providers
    let providers = existingUser.providers.filter(
      p => p.name !== provider.name
    );
    providers.push(provider);
    existingUser.providers = providers;
    existingUser.firstName = userProfile.firstName;
    existingUser.lastName = userProfile.lastName;
    return existingUser.save();
  });
};

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleTokenStrategy);

module.exports = passport;
