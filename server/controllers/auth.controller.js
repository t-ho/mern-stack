const mongoose = require('mongoose');
const createError = require('http-errors');
const passport = require('passport');
const Joi = require('@hapi/joi');
const sendMail = require('../config/nodemailer');
const config = require('../config');

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

const signInSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9.\-_]{4,20}$/),
  email: Joi.string().email(),
  password: Joi.string().required()
}).xor('username', 'email');

function signIn(req, res, next) {
  signInSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;

      req.body.usernameOrEmail = req.body.username || req.body.email;

      passport.authenticate('local', { session: false }, function(
        err,
        user,
        info
      ) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(createError(401, info.message));
        }
        // Login success
        res.json({ token: user.generateJwtToken() });
      })(req, res, next);
    })
    .catch(next);
}

function signUp(req, res, next) {
  signUpSchema
    .validateAsync(req.body)
    .then(payload => {
      req.body = payload;
      return User.findOne({
        $or: [{ email: payload.email }, { username: payload.username }]
      });
    })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.email == req.body.email) {
          throw createError(422, 'Email already in use');
        } else {
          throw createError(422, 'Username already in use');
        }
      }
      const newUser = new User(req.body);
      return newUser.save();
    })
    .then(user => {
      return sendMail({
        to: user.email,
        from: `${config.title} <${config.email.from}>`,
        subject: `${config.title} - Verify your email`,
        template: `${config.paths.root}/templates/signup-verify.email.html`,
        templateParams: {
          appTitle: config.title,
          firstName: user.firstName,
          url: 'FIXME-verify-mail-url',
          signature: config.email.signature
        }
      });
    })
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'A verification email has been sent to your email'
      });
    })
    .catch(next);
}

module.exports = authCtrl;
