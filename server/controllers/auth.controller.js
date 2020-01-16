const mongoose = require('mongoose');
const createError = require('http-errors');
const passport = require('passport');
const Joi = require('@hapi/joi');
const sendMail = require('../config/nodemailer');
const config = require('../config');

const User = mongoose.model('User');

const authCtrl = { signIn, signUp, verifyEmail };

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
        // login success
        res.json({ token: user.generateJwtToken(), user: user.toJSON() });
      })(req, res, next);
    })
    .catch(next);
}

function signUp(req, res, next) {
  let newUser;
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

      newUser = new User(req.body);
      return newUser.setPassword(req.body.password);
    })
    .then(() => {
      if (config.auth.verifyEmail) {
        newUser.setToken('verifyEmail');
        newUser.status = 'unverified';
      }
      return newUser.save();
    })
    .then(user => {
      if (config.auth.verifyEmail) {
        return sendMail({
          to: user.email,
          from: `${config.title} <${config.email.from}>`,
          subject: `${config.title} - Verify your email`,
          template: `${config.paths.root}/templates/signup-verify.email.html`,
          templateParams: {
            appTitle: config.title,
            firstName: user.firstName,
            url: `${config.server.url}/api/auth/verify/${user.token}`,
            signature: config.email.signature
          }
        }).then(result => {
          res.status(201).json({
            success: true,
            message: 'A verification email has been sent to your email'
          });
        });
      }

      res.status(201).json({
        success: true,
        message: 'Your account has been created successfully'
      });
    })
    .catch(next);
}

function verifyEmail(req, res, next) {
  if (!req.params.validationToken) {
    return next(createError(422, 'No token provided'));
  }

  User.findOne({
    token: req.params.validationToken,
    tokenPurpose: 'verifyEmail'
  })
    .then(user => {
      if (!user) {
        throw createError(422, 'Token expired');
      }
      user.clearToken();
      user.status = 'active';
      return user.save();
    })
    .then(user => {
      console.log(user);
      res.status(200).json({ success: true, message: 'Email verified' });
    })
    .catch(next);
}

module.exports = authCtrl;
