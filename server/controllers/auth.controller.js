const mongoose = require('mongoose');
const createError = require('http-errors');

const User = mongoose.model('User');

const authCtrl = { signIn, signUp };

function signIn(req, res, next) {
  if (req.user && req.user._id) {
    //Passport authenticated successfully
    res.json({ token: req.user.generateJwtToken() });
  } else {
    // actually we never reach here
    next(createError(401, 'Sign in failed'));
  }
}

function signUp(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(422, 'Email and password must be specified'));
  }

  const newUser = new User(req.body);
  newUser
    .save()
    .then(user => {
      res.json({ token: user.generateJwtToken() });
    })
    .catch(next);
}

module.exports = authCtrl;
