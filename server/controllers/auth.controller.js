const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');

const User = mongoose.model('User');

const authCtrl = { signIn, signUp };

const signUpSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9.\-_]{4,20}$/),
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string()
    .required()
    .min(8),
  firstName: Joi.string(),
  lastName: Joi.string()
});

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
  let userPayload;
  signUpSchema
    .validateAsync(req.body)
    .then(payload => {
      userPayload = payload;
      return User.findOne({
        $or: [{ email: userPayload.email }, { username: userPayload.username }]
      });
    })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.email == userPayload.email) {
          throw createError(422, 'Email already in use');
        } else {
          throw createError(422, 'Username already in use');
        }
      }
      const newUser = new User(userPayload);
      return newUser.save();
    })
    .then(user => {
      res
        .status(201)
        .json({ token: user.generateJwtToken(), user: user.toJSON() });
    })
    .catch(next);
}

module.exports = authCtrl;
