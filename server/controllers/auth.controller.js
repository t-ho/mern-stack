const mongoose = require('mongoose');
const createError = require('http-errors');

const User = mongoose.model('User');

const userCtrl = { signUp };

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

module.exports = userCtrl;
