const express = require('express');
const authCtrl = require('../../controllers/auth.controller');
const createAuthStrategy = require('../../middleware/createAuthStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthStrategy('jwt');
const localAuthenticate = createAuthStrategy('local');
const googleAuthenticate = createAuthStrategy('google-token');
const facebookAuthenticate = createAuthStrategy('facebook-token');

router.post(
  '/facebook',
  authCtrl.validateFacebookSignInPayload,
  facebookAuthenticate,
  authCtrl.facebookSignIn
);

router.post(
  '/google',
  authCtrl.validateGoogleSignInPayload,
  googleAuthenticate,
  authCtrl.googleSignIn
);

router.post('/verify-token', jwtAuthenticate, authCtrl.verifyToken);

router.post('/reset-password/:token', authCtrl.resetPassword);

router.post('/send-token', authCtrl.sendToken);

router.post(
  '/signin',
  authCtrl.validateLocalSignInPayload,
  localAuthenticate,
  authCtrl.localSignIn
);

router.post('/signup', authCtrl.signUp);

router.post('/verify-email/:token', authCtrl.verifyEmail);

module.exports = router;
