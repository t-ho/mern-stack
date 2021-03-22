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
  authCtrl.facebookSignIn
);

router.post(
  '/google',
  authCtrl.validateGoogleSignInPayload,
  googleAuthenticate,
  authCtrl.googleSignIn
);

router.post('/verify-jwt-token', jwtAuthenticate, authCtrl.verifyJwtToken);

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
