const express = require('express');
const passport = require('passport');
const authCtrl = require('../../controllers/auth.controller');

const router = express.Router();

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  authCtrl.signIn
);

router.post('/signup', authCtrl.signUp);

module.exports = router;
