const createError = require('http-errors');
const constants = require('../core/constants');

const createRequiresRoleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(403, 'Forbidden action'));
    }

    if (role === constants.ROLE_USER) {
      return next();
    }

    if (
      role === constants.ROLE_ADMIN &&
      (req.user.role === constants.ROLE_ROOT ||
        req.user.role === constants.ROLE_ADMIN)
    ) {
      return next();
    }

    if (role === constants.ROLE_ROOT && req.user.role === constants.ROLE_ROOT) {
      return next();
    }

    next(createError(403, 'Forbidden action'));
  };
};

module.exports = createRequiresRoleMiddleware;
