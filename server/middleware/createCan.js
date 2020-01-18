const createError = require('http-errors');
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * @function
 * Create a middleware to determine whether the current user has permission
 * to perform the given action.
 * The action type is attached to res.locals.action
 *
 * If the action is either "updateUsers" or "deleteUsers", it will check the
 * role of the current user and target user (res.locals.targetUser).
 *
 * RULES for updating and deleting users
 * * Root > admin > user (with updateUsers or deleteUsers permission) > user
 * * Users CANNOT perform actions(update or delete) on the other users
 * who have the same role or permissions.
 *
 * Example:
 * * Root users cannot delete other root users.
 * * Users with "updateUsers" permission cannot update others users who
 * also have "updateUsers" permission
 *
 * @param {string} action It could be [readUsers, insertUsers, updateUsers, deleteUsers, ...].
 * See User Schema for a full list of permissions
 */
const createCan = action => {
  return (req, res, next) => {
    res.locals.action = action;

    if (!req.user || (req.user && !req.user.can(action))) {
      return next(createError(401, 'Unauthorized action'));
    }

    if (action !== 'updateUsers' && action !== 'deleteUsers') {
      return next();
    }

    // Now action === 'updateUsers' or action === 'deleteUsers'
    const targetUser = res.locals.targetUser;
    let canContinue = false;
    if (!targetUser || (targetUser && !(targetUser instanceof User))) {
      return next(
        createError(
          500,
          `res.locals.targetUser must be set as an instance of User Model.
          It must be done before calling this middleware`
        )
      );
    }
    if (req.user.role === 'root' && targetUser.role !== 'root') {
      canContinue = true;
    } else if (req.user.role === 'admin' && targetUser.role === 'user') {
      canContinue = true;
    } else if (
      req.user.role === 'user' &&
      targetUser.role === 'user' &&
      !targetUser.can(action)
    ) {
      canContinue = true;
    }
    if (canContinue) {
      return next();
    }
    next(createError(401, 'Unauthorized action'));
  };
};

module.exports = createCan;
