const express = require('express');
const passport = require('passport');
const profilesCtrl = require('../../controllers/profiles.controller');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  profilesCtrl.getProfile
);

router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  profilesCtrl.updateProfile
);

// get Public profile
router.get('/:userId', profilesCtrl.getPublicProfile);

module.exports = router;
