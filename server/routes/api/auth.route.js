const express = require('express');
const authCtrl = require('../../controllers/auth.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');
const googleAuthenticate = createAuthenticationStrategy('google-id-token');
const facebookAuthenticate = createAuthenticationStrategy('facebook-token');

router.post(
  '/facebook',
  authCtrl.validateFacebookSignInPayload,
  facebookAuthenticate,
  authCtrl.signIn
);

router.post(
  '/google',
  authCtrl.validateGoogleSignInPayload,
  googleAuthenticate,
  authCtrl.signIn
);

router.post(
  '/invalidate-all-jwt-tokens',
  jwtAuthenticate,
  authCtrl.invalidateAllJwtTokens
);

router.post('/reset-password/:token', authCtrl.resetPassword);

router.post('/send-token', authCtrl.sendToken);

router.post(
  '/signin',
  authCtrl.validateLocalSignInPayload,
  localAuthenticate,
  authCtrl.signIn
);

router.post('/signup', authCtrl.signUp);

router.post('/verify-email/:token', authCtrl.verifyEmail);

router.post('/verify-jwt-token', jwtAuthenticate, authCtrl.verifyJwtToken);

module.exports = router;
