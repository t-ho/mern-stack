const express = require('express');
const profilesCtrl = require('../../controllers/profiles.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');

const router = express.Router();

const jwtAuthenticate = createAuthenticationStrategy('jwt');

router.get('/', jwtAuthenticate, profilesCtrl.getProfile);

router.put('/', jwtAuthenticate, profilesCtrl.updateProfile);

router.put('/password', jwtAuthenticate, profilesCtrl.updatePassword);

// get Public profile
router.get('/:userId', profilesCtrl.getPublicProfile);

module.exports = router;
