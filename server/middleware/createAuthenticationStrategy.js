const createError = require('http-errors');
const passport = require('passport');

const createAuthenticationStrategy = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) {
      return next(createError(500, err));
    }
    if (!user) {
      return next(createError(401, info.message));
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = createAuthenticationStrategy;
