const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('joi');
const email = require('../core/sendgrid');
const config = require('../config');
const constants = require('../core/constants');

const User = mongoose.model('User');

/**
 * JOI schema for validating resetPassword payload
 */
const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages(constants.ERROR_MESSAGE_EMAIL),
  password: Joi.string()
    .required()
    .min(8)
    .messages(constants.ERROR_MESSAGE_PASSWORD),
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
  if (!config.auth.resetPassword) {
    return next(
      createError(422, 'Password reset functionality is not available')
    );
  }

  if (!req.params.token) {
    return next(createError(422, 'No token provided'));
  }

  let existingUser;

  resetPasswordSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = payload;

      return User.findOne({
        email: req.body.email,
        token: req.params.token,
        tokenPurpose: constants.TOKEN_PURPOSE_RESET_PASSWORD,
      });
    })
    .then((user) => {
      existingUser = user;
      if (!existingUser) {
        throw createError(422, 'Token expired');
      }
      existingUser.clearToken();
      existingUser.setSubId(); // invalidate all issued JWT tokens
      return existingUser.setPasswordAsync(req.body.password);
    })
    .then(() => {
      return existingUser.save();
    })
    .then((user) => {
      res.status(200).json({ message: 'Password reset' });
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
    .messages(constants.ERROR_MESSAGE_EMAIL),
  tokenPurpose: Joi.string()
    .required()
    .valid(
      constants.TOKEN_PURPOSE_VERIFY_EMAIL,
      constants.TOKEN_PURPOSE_RESET_PASSWORD
    ),
});

/**
 * @function sendToken
 * Send a token based on the provided token purpose
 *
 * @param {string} req.body.email The email which will receive token
 * @param {string} req.body.tokenPurpose The token purpose. It can be ['verify-email', 'reset-password']
 */
module.exports.sendToken = (req, res, next) => {
  sendTokenSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = payload;
      if (req.body.tokenPurpose === constants.TOKEN_PURPOSE_RESET_PASSWORD) {
        if (!config.auth.resetPassword) {
          return next(
            createError(422, 'Password reset functionality is not available')
          );
        }
        return sendPasswordResetToken(req, res, next);
      }
      if (req.body.tokenPurpose === constants.TOKEN_PURPOSE_VERIFY_EMAIL) {
        if (!config.auth.verifyEmail) {
          return next(
            createError(
              422,
              'Email verification functionality is not available'
            )
          );
        }

        return sendVerificationEmailToken(req, res, next);
      }
    })
    .catch(next);
};

/**
 * @function invalidateAllJwtTokens
 * Invalidate all issued JWT tokens
 *
 */
module.exports.invalidateAllJwtTokens = (req, res, next) => {
  if (req.user) {
    // Invalidate all JWT tokens by set new subId
    req.user.setSubId();
    return req.user
      .save()
      .then((user) => {
        res
          .status(200)
          .json({ message: 'All JWT tokens have been invalidated' });
      })
      .catch(next);
  }
};

/**
 * JOI schema for validating verifyToken payload
 */
const verifyTokenSchema = Joi.object({
  refreshToken: Joi.boolean().default(false),
  refreshUser: Joi.boolean().default(false),
});

/**
 * @function verifyJwtToken
 * Verify JWT token
 *
 * @param {boolean} req.body.refreshToken If true, a new JWT token will be included in the response
 * @param {boolean} req.body.refreshUser If true, an user object will be included in the response
 */
module.exports.verifyJwtToken = (req, res, next) => {
  verifyTokenSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = payload;
      if (req.user) {
        let result = { message: 'JWT token is valid' };

        if (req.body.refreshToken) {
          result = {
            ...result,
            ...req.user.generateJwtToken(req.user.signedInWithProvider),
          };
        }

        if (req.body.refreshUser) {
          result = {
            ...result,
            user: req.user.toJsonFor(req.user),
          };
        }

        res.status(200).json(result);
      }
    })
    .catch(next);
};

/**
 * JOI schema for validating signIn payload
 */
const localSignInSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9.\-_]{4,30}$/)
    .messages(constants.ERROR_MESSAGE_USERNAME),
  email: Joi.string().email().messages(constants.ERROR_MESSAGE_EMAIL),
  password: Joi.string().required().messages(constants.ERROR_MESSAGE_PASSWORD),
})
  .xor('username', 'email')
  .messages({ 'object.missing': 'Either username or email must be provided' });

/**
 * @function validateLocalSignInPayload
 * Validate local signin payload. Either email or username must be specified.
 *
 * @param {string} req.body.email The email to login
 * @param {string} req.body.username The username to login
 * @param {string} req.body.password The password to login
 */
module.exports.validateLocalSignInPayload = (req, res, next) => {
  localSignInSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = payload;

      req.body.usernameOrEmail = req.body.username || req.body.email;

      next();
    })
    .catch(next);
};

/**
 * JOI schema for validating oauthSignIn payload
 */
const appleSignInSchema = Joi.object({
  code: Joi.string().trim().required(),
  user: Joi.object({
    name: Joi.object({
      firstName: Joi.string().allow(null),
      lastName: Joi.string().allow(null),
    }),
  }),
});

/**
 * @function validateAppleSignInPayload
 * Validate Apple sign-in payload
 *
 * @param {string} req.body.code The authorization code
 * @param {string} [req.body.user] The user object
 */
module.exports.validateAppleSignInPayload = (req, res, next) => {
  appleSignInSchema
    .validateAsync(req.body, { stripUnknown: true })
    .then((payload) => {
      req.body = payload;
      next();
    })
    .catch(next);
};

/**
 * JOI schema for validating googleSignIn payload
 */
const googleSignInSchema = Joi.object({
  idToken: Joi.string().required(),
});

/**
 * @function validateGoogleSignInPayload
 * Validate Google sign-in payload
 *
 * @param {string} req.body.accessToken The Google accessToken
 * @param {string} [req.body.refreshToken] The Google refreshToken
 */
module.exports.validateGoogleSignInPayload = (req, res, next) => {
  googleSignInSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = { id_token: payload.idToken };
      next();
    })
    .catch(next);
};

/**
 * JOI schema for validating facebookSignIn payload
 */
const facebookSignInSchema = Joi.object({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string(),
});

/**
 * @function validateFacebookSignInPayload
 * Validate Facebook sign-in payload
 *
 * @param {string} req.body.accessToken The Facebook accessToken
 * @param {string} [req.body.refreshToken] The Facebook refreshToken
 */
module.exports.validateFacebookSignInPayload = (req, res, next) => {
  facebookSignInSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = { access_token: payload.accessToken };
      if (payload.refreshToken) {
        req.body.refresh_token = payload.refreshToken;
      }
      next();
    })
    .catch(next);
};

/**
 * @function signIn
 * Response with user info
 */
module.exports.signIn = (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      ...req.user.generateJwtToken(req.user.signedInWithProvider),
      signedInWith: req.user.signedInWithProvider,
      user: req.user.toJsonFor(req.user),
    });
  }
};

/**
 * JOI schema for validating signUp payload
 */
const signUpSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9.\-_]{4,30}$/)
    .messages(constants.ERROR_MESSAGE_USERNAME),
  email: Joi.string()
    .required()
    .email()
    .messages(constants.ERROR_MESSAGE_EMAIL),
  password: Joi.string()
    .required()
    .min(8)
    .messages(constants.ERROR_MESSAGE_PASSWORD),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
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
    .then((payload) => {
      req.body = payload;
      return User.findOne({
        $or: [{ email: payload.email }, { username: payload.username }],
      });
    })
    .then((existingUser) => {
      if (existingUser) {
        if (existingUser.email === req.body.email) {
          if (existingUser.provider.local) {
            throw createError(422, 'Email is already in use');
          } else {
            newUser = existingUser;
          }
        } else {
          throw createError(422, 'Username is already in use');
        }
      } else {
        newUser = new User(req.body);
        newUser.setSubId();
      }

      newUser.provider.local = {
        userId: newUser._id,
      };
      return newUser.setPasswordAsync(req.body.password);
    })
    .then(() => {
      if (config.auth.verifyEmail) {
        newUser.setToken(constants.TOKEN_PURPOSE_VERIFY_EMAIL);
        newUser.status = constants.STATUS_UNVERIFIED_EMAIL;
      }
      return newUser.save();
    })
    .then((user) => {
      if (config.auth.verifyEmail) {
        return sendVerificationEmailAsync(user).then((result) => {
          res.status(201).json({
            message: 'A verification email has been sent to your email',
          });
        });
      }

      res.status(201).json({
        message: 'Your account has been created successfully',
      });
    })
    .catch(next);
};

/**
 * JOI schema for validating verifyEmail payload
 */
const verifyEmailSchema = Joi.object({
  password: Joi.string().required().messages(constants.ERROR_MESSAGE_PASSWORD),
});

/**
 * @function verifyEmail
 * Verify email controller
 *
 * @param {string} req.params.token The verification email token
 * @param {string} req.body.password The current password
 */
module.exports.verifyEmail = (req, res, next) => {
  let targetUser = null;
  verifyEmailSchema
    .validateAsync(req.body)
    .then((payload) => {
      req.body = payload;
      if (!config.auth.verifyEmail) {
        return next(
          createError(422, 'Email verification functionality is not available')
        );
      }

      if (!req.params.token) {
        return next(createError(422, 'No token provided'));
      }

      return User.findOne({
        token: req.params.token,
        tokenPurpose: constants.TOKEN_PURPOSE_VERIFY_EMAIL,
      });
    })
    .then((user) => {
      if (!user) {
        throw createError(422, 'Token expired');
      }
      targetUser = user;
      return targetUser.comparePasswordAsync(req.body.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        throw createError(422, 'Password is incorrect');
      }
      targetUser.clearToken();
      targetUser.status = constants.STATUS_ACTIVE;
      return targetUser.save();
    })
    .then((user) => {
      res.status(200).json({ message: 'Email verified' });
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
    .then((user) => {
      if (!user) {
        throw createError(422, 'Email not associated with any acount');
      }

      if (user.token && user.tokenPurpose === req.body.tokenPurpose) {
        return user;
      }

      user.setToken(req.body.tokenPurpose);
      return user.save();
    })
    .then((user) => {
      return sendEmailHelperAsync(
        user,
        'Password reset',
        'Password reset',
        `Someone requested a new password for your ${config.app.title} account.
        If this was you, click button below to reset your password.
        Otherwise, ignore this email.`,
        'Reset Password',
        `${config.server.publicUrl}/reset-password/${user.token}` // FIXME: Fix port number
      );
    })
    .then((result) => {
      res.status(200).json({
        message: 'A password-reset email has been sent to your email',
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
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw createError(422, 'Email not associated with any acount');
      }
      if (user.status !== constants.STATUS_UNVERIFIED_EMAIL) {
        throw createError(422, 'Email already verified');
      }

      if (user.token && user.tokenPurpose === req.body.tokenPurpose) {
        return user;
      }

      user.setToken(req.body.tokenPurpose);
      return user.save();
    })
    .then((user) => {
      return sendVerificationEmailAsync(user);
    })
    .then((result) => {
      res.status(200).json({
        message: 'A verification email has been sent to your email',
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
const sendVerificationEmailAsync = (user) => {
  return sendEmailHelperAsync(
    user,
    'Verify your email',
    `Welcome to ${config.app.title}`,
    'Before you can start using your account, please verify it by following the link below:',
    'Verify Email',
    `${config.server.publicUrl}/verify-email/${user.token}` // FIXME: fix port number
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
  return email.send({
    to: user.email,
    from: `${config.app.title} <${config.email.from}>`,
    subject: `${config.app.title} - ${subject}`,
    templatePath: `${config.paths.root}/templates/email.html`,
    dynamicTemplateData: {
      boxTitle: title,
      content,
      buttonText,
      url,
      signature: config.email.signature,
      appTitle: config.app.title,
      publicUrl: config.server.publicUrl,
    },
  });
};
