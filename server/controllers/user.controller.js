const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const createError = require('http-errors');

const User = mongoose.model('User');

/**
 * Joi schema for validating getUser query
 */
const getUserSchema = Joi.object({
  sort: Joi.string()
    .trim()
    .pattern(/^(-?[A-Za-z]+)( -?[A-Za-z]+)*$/), // matches "-descFieldName ascFieldName"
  limit: Joi.number()
    .integer()
    .default(30),
  skip: Joi.number()
    .integer()
    .default(0)
});

/**
 * @function getUsers
 * Get users controller
 *
 * @param {string} [req.query.sort] The sort order string. It must be a space
 * delimited list of path names. The sort order of each path is ascending
 * unless the path name is prefixed with "-" which will be treated as descending.
 * @param {number} [req.query.limit] The limit number (default: 30)
 * @param {number} [req.query.skip] The skip number (default: 0)
 */
module.exports.getUsers = (req, res, next) => {
  getUserSchema
    .validateAsync(req.query)
    .then(payload => {
      req.query = payload;
      return Promise.all([
        User.find({})
          .sort(req.query.sort)
          .limit(req.query.limit)
          .skip(req.query.skip)
          .exec(),
        User.find({}).countDocuments()
      ]);
    })
    .then(results => {
      const [users, usersCount] = results;
      res.status(200).json({ users, usersCount });
    })
    .catch(next);
};

/**
 * @function preloadTargetUser
 * Preload the target user object and assign it to res.locals.targetUser.
 *
 * @param {string} userId The target user ID
 */
module.exports.preloadTargetUser = (req, res, next, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(createError(422, 'Invalid user ID'));
  }

  User.findById(userId)
    .then(targetUser => {
      if (!targetUser) {
        throw createError(422, 'User ID does not exist');
      }
      res.locals.targetUser = targetUser;
      next();
    })
    .catch(next);
};

/**
 * @function deletedUser
 * Delete the target user
 */
module.exports.deleteUser = (req, res, next) => {
  res.locals.targetUser
    .delete()
    .then(deletedUser => {
      res.sendStatus(204);
    })
    .catch(next);
};

/**
 * Joi schema for validating updateUser payload
 */
const updateUserSchema = Joi.object({
  role: Joi.string().valid('admin', 'user'),
  status: Joi.string().valid('active', 'unverifiedEmail'),
  permissions: Joi.object()
});

/**
 * @function updatedUser
 * Update user controller.
 *
 * Only root can set role for others
 *
 * @param {string} [req.body.role] The role could be 'admin' or 'user'
 * @param {status} [req.body.status] The status of user
 * @param {object} [req.body.permissions] The permissions object
 */
module.exports.updateUser = (req, res, next) => {
  updateUserSchema
    .validateAsync(req.body, { stripUnknown: true })
    .then(payload => {
      if (
        req.user.role === 'admin' &&
        payload.role &&
        payload.role !== 'user'
      ) {
        throw createError(401, 'Unauthorized action');
      }
      _.merge(res.locals.targetUser, req.body);
      return res.locals.targetUser.save();
    })
    .then(updatedUser => {
      res.sendStatus(204);
    })
    .catch(next);
};
