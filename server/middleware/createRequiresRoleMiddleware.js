const createError = require('http-errors');

const createRequiresRoleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(403, 'Forbidden action'));
    }

    if (role === 'user') {
      return next();
    }

    if (
      role === 'admin' &&
      (req.user.role === 'root' || req.user.role === 'admin')
    ) {
      return next();
    }

    if (role === 'root' && req.user.role === 'root') {
      return next();
    }

    next(createError(403, 'Forbidden action'));
  };
};

module.exports = createRequiresRoleMiddleware;
