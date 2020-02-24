const createError = require('http-errors');
const passport = require('passport');
const _ = require('lodash');

/**
 * @function
 * Create an authentication middleware using given strategy
 *
 * @param {string} strategy The passport strategy
 * @param {function} callback If callback is specified, it will be called as callback(req, res, next, user)
 */
const createAuthStrategy = (strategy, callback) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, function(
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
    if (_.isFunction(callback)) {
      return callback(req, res, next, user);
    }
    return next();
  })(req, res, next);
};

module.exports = createAuthStrategy;
