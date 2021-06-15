const express = require('express');
const authCtrl = require('../../controllers/auth.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createRateLimiterMiddleware = require('../../middleware/createRateLimiterMiddleware');
const config = require('../../config');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const localAuthenticate = createAuthenticationStrategy('local');

/**
 * Block after 20 failed requests in 15 mins
 */
const failedRateLimiter = createRateLimiterMiddleware({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

/**
 * Block after 5 successful requests in 15 mins
 */
const successfulRateLimiter = createRateLimiterMiddleware({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipFailedRequests: true,
});

if (config.auth.appleSignIn) {
  const appleAuthenticate = createAuthenticationStrategy('apple');
  router.post(
    '/apple',
    failedRateLimiter,
    authCtrl.validateAppleSignInPayload,
    appleAuthenticate,
    authCtrl.signIn
  );
}

if (config.auth.facebookSignIn) {
  const facebookAuthenticate = createAuthenticationStrategy('facebook-token');
  router.post(
    '/facebook',
    failedRateLimiter,
    authCtrl.validateFacebookSignInPayload,
    facebookAuthenticate,
    authCtrl.signIn
  );
}

if (config.auth.googleSignIn) {
  const googleAuthenticate = createAuthenticationStrategy('google-id-token');
  router.post(
    '/google',
    failedRateLimiter,
    authCtrl.validateGoogleSignInPayload,
    googleAuthenticate,
    authCtrl.signIn
  );
}

router.post(
  '/invalidate-all-jwt-tokens',
  failedRateLimiter,
  jwtAuthenticate,
  authCtrl.invalidateAllJwtTokens
);

router.post(
  '/reset-password/:token',
  failedRateLimiter,
  authCtrl.resetPassword
);

router.post('/send-token', successfulRateLimiter, authCtrl.sendToken);

router.post(
  '/signin',
  failedRateLimiter,
  authCtrl.validateLocalSignInPayload,
  localAuthenticate,
  authCtrl.signIn
);

router.post('/signup', successfulRateLimiter, authCtrl.signUp);

router.post('/verify-email/:token', failedRateLimiter, authCtrl.verifyEmail);

router.post(
  '/verify-jwt-token',
  failedRateLimiter,
  jwtAuthenticate,
  authCtrl.verifyJwtToken
);

module.exports = router;
