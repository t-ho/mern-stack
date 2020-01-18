const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const _ = require('lodash');

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
