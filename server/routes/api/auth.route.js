const express = require('express');
const authCtrl = require('../../controllers/auth.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const config = require('../../config');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');

if (config.auth.appleSignIn) {
  const appleAuthenticate = createAuthenticationStrategy('apple');
  router.post(
    '/apple',
    authCtrl.validateAppleSignInPayload,
    appleAuthenticate,
    authCtrl.signIn
  );
}

if (config.auth.facebookSignIn) {
  const facebookAuthenticate = createAuthenticationStrategy('facebook-token');
  router.post(
    '/facebook',
    authCtrl.validateFacebookSignInPayload,
    facebookAuthenticate,
    authCtrl.signIn
  );
}

if (config.auth.facebookSignIn) {
  const googleAuthenticate = createAuthenticationStrategy('google-id-token');
  router.post(
    '/google',
    authCtrl.validateGoogleSignInPayload,
    googleAuthenticate,
    authCtrl.signIn
  );
}

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
