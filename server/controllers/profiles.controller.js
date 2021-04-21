const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('joi');
const _ = require('lodash');
const constants = require('../core/constants');

const User = mongoose.model('User');

/**
 * @function getProfile
 * Get profile controller
 *
 */
module.exports.getProfile = (req, res, next) => {
  if (req.user) {
    res.status(200).send({ profile: req.user.toJsonFor(req.user) });
  }
};

/**
 * JOI schema for validating updatePassword payload
 */
const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .messages(constants.ERROR_MESSAGE_CURRENT_PASSWORD)
    .required(),
  password: Joi.string()
    .min(8)
    .messages(constants.ERROR_MESSAGE_PASSWORD)
    .required(),
});

/**
 * @function updatePassword
 * Get profile controller
 *
 * @param {string} [req.body.currentPassword] The current password to update
 * @param {string} [req.body.password] The new password to update
 */
module.exports.updatePassword = (req, res, next) => {
  if (req.user) {
    updatePasswordSchema
      .validateAsync(req.body, { stripUnknown: true })
      .then((payload) => {
        req.body = payload;
        if (req.body.password === req.body.currentPassword) {
          throw createError(
            422,
            'New password is the same as current password'
          );
        }
        if (req.user.signedInWithProvider !== constants.PROVIDER_LOCAL) {
          throw createError(403, 'Cannot change the password of OAuth account');
        }
        return req.user.comparePasswordAsync(req.body.currentPassword);
      })
      .then((matched) => {
        if (!matched) {
          throw createError(422, 'Current password is incorrect');
        }
        req.user.setSubId(); // invalidate all existing JWT tokens
        return req.user.setPasswordAsync(req.body.password);
      })
      .then(() => {
        return req.user.save();
      })
      .then((user) => {
        let jwtTokenObj = user.generateJwtToken(req.user.signedInWithProvider);
        res.status(200).json({ ...jwtTokenObj });
      })
      .catch(next);
  }
};

/**
 * JOI schema for validating updateProfile payload
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
});

/**
 * @function updateProfile
 * Get profile controller
 *
 * @param {string} [req.body.firstName] The first name to update
 * @param {string} [req.body.lastName] The last name to update
 */
module.exports.updateProfile = (req, res, next) => {
  if (req.user) {
    if (_.isEmpty(req.body)) {
      return res.status(200).json({ updatedFields: [] });
    }
    updateProfileSchema
      .validateAsync(req.body, { stripUnknown: true })
      .then((payload) => {
        req.body = payload;
        req.user = _.merge(req.user, req.body);
        return req.user.save();
      })
      .then((updatedUser) => {
        res.status(200).json({
          user: updatedUser.toJsonFor(req.user),
          updatedFields: _.keys(req.body),
        });
      })
      .catch(next);
  }
};

/**
 * @function getPublicProfile
 * Get public profile controller
 *
 * @param {string} req.params.userId The user ID
 */
module.exports.getPublicProfile = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return next(createError(422, 'Invalid user ID'));
  }

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw createError(422, 'User ID does not exist');
      }
      res.status(200).send({ profile: user.toJsonFor() });
    })
    .catch(next);
};
