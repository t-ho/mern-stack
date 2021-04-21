const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const AppleStrategy = require('@nicokaiser/passport-apple');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleIdTokenStrategy = require('passport-google-id-token');
const config = require('../config');
const constants = require('./constants');

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

          handleAuthByCheckingUserStatus(user, done, constants.PROVIDER_LOCAL);
        });
      })
      .catch(done);
  }
);

passport.use(localStrategy);

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

        if (!jwtPayload.sub || user.subId !== jwtPayload.sub) {
          return done(null, false, { message: 'Invalid JWT token' });
        }

        handleAuthByCheckingUserStatus(user, done, jwtPayload.provider);
      })
      .catch(done);
  }
);

passport.use(jwtStrategy);

if (config.auth.appleSignIn) {
  // Create Apple Strategy
  const appleStrategy = new AppleStrategy(
    {
      clientID: config.apple.clientId,
      teamID: config.apple.teamId,
      keyID: config.apple.keyId,
      key: config.apple.privateKey,
      scope: ['name', 'email'],
    },
    function (accessToken, refreshToken, profile, done) {
      const { id, name: { firstName, lastName } = {}, email } = profile;
      // Note: the firstName and lastName properties are only available on the first login
      const userProfile = {
        provider: constants.PROVIDER_APPLE,
        userId: id,
        email,
        username: generateUsername(email, firstName, lastName, id),
        firstName,
        lastName,
        picture: profile.picture,
      };

      handleOAuth(userProfile, done, constants.PROVIDER_APPLE);
    }
  );

  passport.use(appleStrategy);
}

if (config.auth.facebookSignIn) {
  // Create Facebook Token Strategy
  const facebookTokenStrategy = new FacebookTokenStrategy(
    {
      clientID: config.oauth.facebook.clientId,
      clientSecret: config.oauth.facebook.clientSecret,
    },
    function (accessToken, refreshToken, profile, done) {
      const userProfile = {
        provider: constants.PROVIDER_FACEBOOK,
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

      handleOAuth(userProfile, done, constants.PROVIDER_FACEBOOK);
    }
  );

  passport.use(facebookTokenStrategy);
}

if (config.auth.googleSignIn) {
  // Create Google Id Token Strategy
  const googleIdTokenStrategy = new GoogleIdTokenStrategy(
    {
      clientID: config.oauth.google.clientId,
    },
    function ({ payload: profile }, googleId, done) {
      const userProfile = {
        provider: constants.PROVIDER_GOOGLE,
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

      handleOAuth(userProfile, done, constants.PROVIDER_GOOGLE);
    }
  );

  passport.use(googleIdTokenStrategy);
}

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
const generateUsername = (email, firstName, lastName, id) => {
  let username = '';
  if (email) {
    username = email.split('@')[0];
  } else if (firstName && lastName) {
    username = `${firstName}${lastName}${generateRandomNumber()}`;
  } else if (id) {
    username = id;
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
 * @returns {Promise} Resolve with the object {user, isNewUser}
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
      return findUniqueUsername(userProfile.username)
        .then((availableUsername) => {
          let user = new User({
            email: userProfile.email,
            username: availableUsername,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            status: constants.STATUS_ACTIVE,
            provider: {
              [userProfile.provider]: provider,
            },
          });
          user.setSubId();
          return user.save();
        })
        .then((user) => {
          return { user, isNewUser: true };
        });
    }
    // user already exists, update provider
    existingUser.provider[userProfile.provider] = provider;
    // Note: firstName and lastName are only available on the first Apple login
    if (userProfile.provider !== constants.PROVIDER_APPLE) {
      existingUser.firstName = userProfile.firstName;
      existingUser.lastName = userProfile.lastName;
    }
    return existingUser.save().then((user) => {
      return { user, isNewUser: false };
    });
  });
};

/**
 * Handle authentication based on user status.
 * Note: The specified user must be not null
 *
 * @param {object} user
 * @param {function} done
 * @param {string} provider Default: 'local'
 *
 * @returns
 */
const handleAuthByCheckingUserStatus = (
  user,
  done,
  provider = constants.PROVIDER_LOCAL
) => {
  // Make sure user exists
  if (!user) {
    return done(null, false, { message: 'User does not exist' });
  }

  // authorized
  if (
    user.status === constants.STATUS_ACTIVE ||
    // unverified-email status should NOT block the user who signed in with Google or Facebook OAuth
    (user.status === constants.STATUS_UNVERIFIED_EMAIL &&
      provider !== constants.PROVIDER_LOCAL)
  ) {
    user.signedInWithProvider = provider;
    return done(null, user);
  }

  // Before denying all other statuses, return helpful message where possible

  if (user.status === constants.STATUS_DISABLED) {
    return done(null, false, { message: 'Account is disabled' });
  }

  if (config.auth.verifyEmail && provider === constants.PROVIDER_LOCAL) {
    if (user.status === constants.STATUS_UNVERIFIED_EMAIL) {
      return done(null, false, { message: 'Email is not verified' });
    }
  }

  done(null, false, { message: 'Account status is invalid' });
};

/**
 * Handle OAuth authentication
 *
 * @param {object} userProfile
 * @param {function} done
 */
const handleOAuth = (userProfile, done, provider) => {
  updateOrInsert(userProfile)
    .then(({ user, isNewUser }) => {
      // check the status
      handleAuthByCheckingUserStatus(user, done, provider);
    })
    .catch(done);
};

module.exports = passport;
