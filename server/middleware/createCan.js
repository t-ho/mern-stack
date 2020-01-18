const createError = require('http-errors');

/**
 * @function
 * Create a middleware to detemine whether the current user
 * has permission to perform the give action
 *
 * @param {string} action It could be [readUsers, insertUsers, updateUsers, deleteUsers, ...].
 * See User Schema for a full list of permissions
 */
const createCan = action => {
  return (req, res, next) => {
    if (req.user && req.user.can(action)) {
      next();
    } else {
      next(createError(401, 'Unauthorized action'));
    }
  };
};

module.exports = createCan;
