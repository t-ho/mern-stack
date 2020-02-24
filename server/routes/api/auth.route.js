const express = require('express');
const passport = require('passport');
const authCtrl = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/google', authCtrl.googleSignIn);

router.post(
  '/refresh-token',
  passport.authenticate('jwt', { session: false }),
  authCtrl.refreshToken
);

router.post('/reset-password/:token', authCtrl.resetPassword);

router.post('/send-token', authCtrl.sendToken);

router.post('/signin', authCtrl.localSignIn);

router.post('/signup', authCtrl.signUp);

router.post('/verify-email/:token', authCtrl.verifyEmail);

module.exports = router;
