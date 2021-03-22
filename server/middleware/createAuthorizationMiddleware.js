const createError = require('http-errors');
const _ = require('lodash');
const config = require('../config');
const constants = require('../core/constants');

/**
 * @function
 * Create a middleware to determine whether the current user has permission
 * to perform the given action on the given model.
 *
 * @param {string} modelName A model name
 * @param {string} action An action
 * See User Schema for a full list of permissions
 *
 */
const createAuthorizationMiddleware = (modelName, action) => {
  action = _.toLower(action);
  modelName = _.camelCase(modelName);
  const permission = _.camelCase(`${modelName} ${action}`);
  const instanceName = _.camelCase(`target ${modelName}`);

  return (req, res, next) => {
    if (
      req.user &&
      (req.user.role === constants.ROLE_ROOT ||
        req.user.role === constants.ROLE_ADMIN ||
        req.user.hasPermission(permission))
    ) {
      return next();
    }

    if (action === 'modify' && config.allowCreatorModify[modelName]) {
      const target = res.locals[instanceName];
      if (!target) {
        return next(
          createError(500, `res.locals.${instanceName} is undefined.`)
        );
      }
      if (target.createdBy.toString() === req.user.id) {
        // The creator is allow to modify the target
        return next();
      }
    }

    next(createError(403, 'Forbidden action'));
  };
};

module.exports = createAuthorizationMiddleware;
