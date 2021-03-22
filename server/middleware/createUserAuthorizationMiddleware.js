const createError = require('http-errors');
const _ = require('lodash');
const constants = require('../core/constants');

/**
 * @function
 * Create a middleware to determine whether the current user has permission
 * to perform the given action on User model.
 *
 * If the action == "modify", it will check the
 * role of the current user and target user (res.locals.targetUser).
 *
 * RULES for modifying (updating and deleting) users
 * * Root > admin > user
 * * Root CAN do anything
 * * Admin CANNOT modify other admin and root
 * * User with "userModify" permission CANNOT update root, admin and other user with "userModify" permission
 * * Admin and User CANNOT modify themselves
 *
 * Example:
 * * Root users cannot update or delete other root users.
 * * Admin users cannot update or delete root users.
 *
 * @param {string} action An action
 * See User Schema for a full list of permissions
 *
 */
const createUserAuthorizationMiddleware = (action) => {
  action = _.toLower(action);
  const permission = _.camelCase(`user ${action}`);

  return (req, res, next) => {
    if (!req.user) {
      return next(createError(403, 'Forbidden action'));
    }

    if (req.user.role === constants.ROLE_ROOT) {
      return next();
    }

    if (!req.user.hasPermission(permission)) {
      return next(createError(403, 'Forbidden action'));
    }

    if (action !== 'modify') {
      return next();
    }

    // Now action == 'modify'
    const targetUser = res.locals.targetUser;
    if (!targetUser) {
      return next(createError(500, 'res.locals.targetUser is undefined.'));
    }
    if (
      req.user.role === constants.ROLE_ADMIN &&
      targetUser.role === constants.ROLE_USER
    ) {
      return next();
    } else if (
      req.user.role === constants.ROLE_USER &&
      targetUser.role === constants.ROLE_USER &&
      targetUser.permissions['userModify'] === false
    ) {
      return next();
    }

    next(createError(403, 'Forbidden action'));
  };
};

module.exports = createUserAuthorizationMiddleware;
