const mongoose = require('mongoose');
const createError = require('http-errors');
const passport = require('passport');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const sendMail = require('../config/nodemailer');
const config = require('../config');

const User = mongoose.model('User');

/**
 * @function getProfile
 * Get profile controller
 */
module.exports.getProfile = (req, res, next) => {
  if (req.user) {
    res.status(200).send({ profile: req.user.toJSON() });
  }
};

/**
 * JOI schema for validating updateProfile payload
 */
const updateProfileSchema = Joi.object({
  password: Joi.string().min(8),
  firstName: Joi.string(),
  lastName: Joi.string()
});

/**
 * @function updateProfile
 * Get profile controller
 *
 * @param {string} [password] The password to update
 * @param {string} [firstName] The first name to update
 * @param {string} [lastName] The last name to update
 */
module.exports.updateProfile = (req, res, next) => {
  if (req.user) {
    updateProfileSchema
      .validateAsync(req.body, { allowUnknown: true, stripUnknown: true })
      .then(payload => {
        console.log('payload', payload);
        req.body = payload;
        const { password, ...others } = req.body;
        _.merge(req.user, others);
        if (password) {
          return req.user.setPassword(password);
        }
      })
      .then(() => {
        return req.user.save();
      })
      .then(updatedUser => {
        res.status(200).json({ updatedFields: _.keys(req.body) });
      })
      .catch(next);
  }
};

/**
 * JOI schema for validating resetPassword payload
 */
const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email(),
  newPassword: Joi.string()
    .required()
    .min(8)
});

/**
 * @function
 * Reset password controller
 *
 * @param {string} req.params.token The reset password token
 * @param {string} req.body.email The email
 * @param {string} req.body.newPassword The new password
 */
module.exports.resetPassword = (req, res, next) => {
  if (!req.params.token) {
    return next(createError(422, 'No token provided'));
  }

  let existingUser;

  resetPasswordSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;

      return User.findOne({
        email: req.body.email,
        token: req.params.token,
        tokenPurpose: 'resetPassword'
      });
    })
    .then(user => {
      existingUser = user;
      if (!existingUser) {
        throw createError(422, 'Token expired');
      }
      existingUser.clearToken();
      return existingUser.setPassword(req.body.newPassword);
    })
    .then(() => {
      return existingUser.save();
    })
    .then(user => {
      res.status(200).json({ success: true, message: 'Password reset' });
    })
    .catch(next);
};

/**
 * JOI schema for validating sendToken payload
 */
const sendTokenSchema = Joi.object({
  email: Joi.string()
    .required()
    .email(),
  tokenPurpose: Joi.string()
    .required()
    .valid('verifyEmail', 'resetPassword')
});

/**
 * @function sendToken
 * Send a token based the provided token purpose
 *
 * @param {string} req.body.email The email which will receive token
 * @param {string} req.body.tokenPurpose The token purpose. It can be ['verifyEmail', 'resetPassword']
 */
module.exports.sendToken = (req, res, next) => {
  sendTokenSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;
      if (req.body.tokenPurpose === 'resetPassword') {
        return sendPasswordResetToken(req, res, next);
      }
      if (req.body.tokenPurpose === 'verifyEmail') {
        return sendVerificationEmailToken(req, res, next);
      }
    })
    .catch(next);
};

/**
 * JOI schema for validating signIn payload
 */
const signInSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9.\-_]{4,20}$/),
  email: Joi.string().email(),
  password: Joi.string().required()
}).xor('username', 'email');

/**
 * @function signIn
 * Sign in controller. Either email or username must be specified.
 *
 * @param {string} req.body.email The email to login
 * @param {string} req.body.username The username to login
 * @param {string} req.body.password The password to login
 */
module.exports.signIn = (req, res, next) => {
  signInSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;

      req.body.usernameOrEmail = req.body.username || req.body.email;

      passport.authenticate('local', { session: false }, function(
        err,
        user,
        info
      ) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(createError(401, info.message));
        }
        // login success
        res.json({ token: user.generateJwtToken(), user: user.toJSON() });
      })(req, res, next);
    })
    .catch(next);
};

/**
 * JOI schema for validating signUp payload
 */
const signUpSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9.\-_]{4,30}$/),
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string()
    .required()
    .min(8),
  firstName: Joi.string(),
  lastName: Joi.string()
});

/**
 * @function signUp
 * Sign up controller
 *
 * @param {string} req.body.email The email to sign up
 * @param {string} req.body.username The username to sign up
 * @param {string} req.body.password The password to sign up
 * @param {string} [req.body.firstName] The user's first name
 * @param {string} [req.body.lastName] The user's last name
 */
module.exports.signUp = (req, res, next) => {
  let newUser;
  signUpSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;
      return User.findOne({
        $or: [{ email: payload.email }, { username: payload.username }]
      });
    })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.email == req.body.email) {
          throw createError(422, 'Email already in use');
        } else {
          throw createError(422, 'Username already in use');
        }
      }

      newUser = new User(req.body);
      return newUser.setPassword(req.body.password);
    })
    .then(() => {
      if (config.auth.verifyEmail) {
        newUser.setToken('verifyEmail');
        newUser.status = 'unverifiedEmail';
      }
      return newUser.save();
    })
    .then(user => {
      if (config.auth.verifyEmail) {
        return sendVerificationEmail(user).then(result => {
          res.status(201).json({
            success: true,
            message: 'A verification email has been sent to your email'
          });
        });
      }

      res.status(201).json({
        success: true,
        message: 'Your account has been created successfully'
      });
    })
    .catch(next);
};

/**
 * JOI schema for validating verifyEmail payload
 */
const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
});

/**
 * @function verifyEmail
 * Verify email controller
 *
 * @param {string} req.params.token The verification email token
 * @param {string} req.body.email The email to verify
 */
module.exports.verifyEmail = (req, res, next) => {
  if (!req.params.token) {
    return next(createError(422, 'No token provided'));
  }

  verifyEmailSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;

      return User.findOne({
        email: req.body.email,
        token: req.params.token,
        tokenPurpose: 'verifyEmail'
      });
    })
    .then(user => {
      if (!user) {
        throw createError(422, 'Token expired');
      }
      user.clearToken();
      user.status = 'active';
      return user.save();
    })
    .then(user => {
      res.status(200).json({ success: true, message: 'Email verified' });
    })
    .catch(next);
};

/**
 * @function sendPasswordResetToken
 * Send password-reset token helper
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const sendPasswordResetToken = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        throw createError(422, 'Email not associated with any acount');
      }
      user.setToken(req.body.tokenPurpose);
      return user.save();
    })
    .then(user => {
      return sendEmailHelper(
        user,
        'Password reset',
        'Password reset',
        `Someone requested a new password for your ${config.appName} account.
        If this was you, click button below to reset your password.
        Otherwise, ignore this email.`,
        'Reset Password',
        `${config.server.url}:${config.server.port}/api/auth/reset-password/${user.token}`
      );
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: 'A password-reset email has been sent to your email'
      });
    })
    .catch(next);
};

/**
 * @function sendVerificationEmailToken
 * Send verification email token
 *
 * Helper function
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const sendVerificationEmailToken = (req, res, next) => {
  if (!config.auth.verifyEmail) {
    return next(createError(404, 'Unknown request'));
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        throw createError(422, 'Email not associated with any acount');
      }
      if (user.status !== 'unverifiedEmail') {
        throw createError(422, 'Email already verified');
      }
      user.setToken(req.body.tokenPurpose);
      return user.save();
    })
    .then(user => {
      return sendVerificationEmail(user);
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: 'A verification email has been sent to your email'
      });
    })
    .catch(next);
};

/**
 * @function sendVerificationEmail
 * Send verification email
 *
 * Helper function
 *
 * @param {object} user The user object who receives the email
 * @returns {Promise} Resolve with a sending result object
 */
const sendVerificationEmail = user => {
  return sendEmailHelper(
    user,
    'Verify your email',
    `Welcome to ${config.appName}`,
    'Before you can start using your account, please verify it by following the link below:',
    'Verify Email',
    `${config.server.url}:${config.server.port}/api/auth/verify-email/${user.token}`
  );
};

/**
 * @function sendEmailHelper
 * Send an email
 *
 * Helper function
 *
 * @param {object} user The user object who receives the email
 * @param {string} subject The subject portion of the email
 * @param {string} title The table title
 * @param {string} content The content
 * @param {string} buttonText Then button text
 * @param {string} url The action url link
 * @returns {Promise} Resolve with a sending result object
 */
const sendEmailHelper = (user, subject, title, content, buttonText, url) => {
  return sendMail({
    to: user.email,
    from: `${config.appName} <${config.email.from}>`,
    subject: `${config.appName} - ${subject}`,
    template: `${config.paths.root}/templates/email.html`,
    templateParams: {
      title: title,
      firstName: user.firstName,
      content,
      buttonText,
      url,
      signature: config.email.signature
    }
  });
};
