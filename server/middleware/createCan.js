const createError = require('http-errors');
const mongoose = require('mongoose');
const _ = require('lodash');

const User = mongoose.model('User');

/**
 * @function
 * Create a middleware to determine whether the current user has permission
 * to perform the given actions.
 *
 * If the actions array contains "usersModify", it will check the
 * role of the current user and target user (res.locals.targetUser).
 *
 * RULES for modifying (updating and deleting) users
 * * Root > admin > user
 * * Root CAN do anything
 * * Admin CANNOT modify other admin and root
 * * User with "usersModify" permission CANNOT update root, admin and other user with "usersModify" permission
 * * Admin and User CANNOT modify themselves
 *
 * Example:
 * * Root users cannot update or delete other root users.
 * * Admin users cannot update or delete root users.
 *
 * @param {string|array} actions An action or array of actions.
 * @param {boolean=false} requiresAny If true, at least one action must pass to continue. Otherwise, ALL actions must be pass to continue.
 * See User Schema for a full list of permissions
 *
 */
const createCan = (actions, requiresAny = false) => (req, res, next) => {
  if (req.user && req.user.role === 'root') {
    return next();
  }

  if (!req.user || (req.user && !req.user.can(actions, requiresAny))) {
    return next(createError(403, 'Forbidden action'));
  }

  if (_.castArray(actions).every((action) => action !== 'usersModify')) {
    return next();
  }

  // Now 'usersModify' is in the list of actions
  const targetUser = res.locals.targetUser;
  let canContinue = false;
  if (!targetUser || (targetUser && !(targetUser instanceof User))) {
    return next(
      createError(
        500,
        `res.locals.targetUser must be set as an instance of User Model.
          It must be done before calling this middleware.`
      )
    );
  }
  if (req.user.role === 'admin' && targetUser.role === 'user') {
    canContinue = true;
  } else if (
    req.user.role === 'user' &&
    targetUser.role === 'user' &&
    targetUser.permissions['usersModify'] === false
  ) {
    canContinue = true;
  }

  if (canContinue) {
    return next();
  }
  next(createError(403, 'Forbidden action'));
};

module.exports = createCan;
