const mongoose = require('mongoose');
const createError = require('http-errors');
const passport = require('passport');
const Joi = require('@hapi/joi');
const sendMailAsync = require('../config/nodemailer');
const config = require('../config');
const constants = require('./constants');

const User = mongoose.model('User');

/**
 * JOI schema for validating resetPassword payload
 */
const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages(constants.EMAIL_ERROR_MESSAGES),
  password: Joi.string()
    .required()
    .min(8)
    .messages(constants.PASSWORD_ERROR_MESSAGES)
});

/**
 * @function resetPassword
 * Reset password controller
 *
 * @param {string} req.params.token The reset password token
 * @param {string} req.body.email The email
 * @param {string} req.body.password The new password
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
      return existingUser.setPasswordAsync(req.body.password);
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
    .email()
    .messages(constants.EMAIL_ERROR_MESSAGES),
  tokenPurpose: Joi.string()
    .required()
    .valid('verifyEmail', 'resetPassword')
});

/**
 * @function sendToken
 * Send a token based on the provided token purpose
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
 * @function refreshToken
 * Refresh JWT token
 *
 */
module.exports.refreshToken = (req, res, next) => {
  if (req.user) {
    jwtTokenObj = req.user.generateJwtToken();
    res.json({ ...jwtTokenObj, user: req.user.toJSON() });
  }
};

/**
 * JOI schema for validating signIn payload
 */
const signInSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9.\-_]{4,30}$/)
    .messages(constants.USERNAME_ERROR_MESSAGE),
  email: Joi.string()
    .email()
    .messages(constants.EMAIL_ERROR_MESSAGES),
  password: Joi.string()
    .required()
    .messages(constants.PASSWORD_ERROR_MESSAGES)
})
  .xor('username', 'email')
  .messages({ 'object.missing': 'Either username or email must be provided.' });

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
        jwtTokenObj = user.generateJwtToken();
        res.json({ ...jwtTokenObj, user: user.toJSON() });
      })(req, res, next);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

/**
 * JOI schema for validating signUp payload
 */
const signUpSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9.\-_]{4,30}$/)
    .messages(constants.USERNAME_ERROR_MESSAGE),
  email: Joi.string()
    .required()
    .email()
    .messages(constants.EMAIL_ERROR_MESSAGES),
  password: Joi.string()
    .required()
    .min(8)
    .messages(constants.PASSWORD_ERROR_MESSAGES),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim()
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
          throw createError(422, 'Email is already in use');
        } else {
          throw createError(422, 'Username is already in use');
        }
      }

      newUser = new User(req.body);
      return newUser.setPasswordAsync(req.body.password);
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
        return sendVerificationEmailAsync(user).then(result => {
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
 * @function verifyEmail
 * Verify email controller
 *
 * @param {string} req.params.token The verification email token
 */
module.exports.verifyEmail = (req, res, next) => {
  if (!req.params.token) {
    return next(createError(422, 'No token provided'));
  }

  return User.findOne({
    token: req.params.token,
    tokenPurpose: 'verifyEmail'
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
      return sendEmailHelperAsync(
        user,
        'Password reset',
        'Password reset',
        `Someone requested a new password for your ${config.appName} account.
        If this was you, click button below to reset your password.
        Otherwise, ignore this email.`,
        'Reset Password',
        `${config.server.url}:3000/reset-password/${user.token}` // FIXME: Fix port number
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
      return sendVerificationEmailAsync(user);
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
const sendVerificationEmailAsync = user => {
  return sendEmailHelperAsync(
    user,
    'Verify your email',
    `Welcome to ${config.appName}`,
    'Before you can start using your account, please verify it by following the link below:',
    'Verify Email',
    `${config.server.url}:3000/verify-email/${user.token}` // FIXME: fix port number
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
const sendEmailHelperAsync = (
  user,
  subject,
  title,
  content,
  buttonText,
  url
) => {
  return sendMailAsync({
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
