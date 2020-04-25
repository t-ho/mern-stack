const express = require('express');
const profilesCtrl = require('../../controllers/profiles.controller');
const createAuthStrategy = require('../../middleware/createAuthStrategy');

const router = express.Router();

const jwtAuthenticate = createAuthStrategy('jwt');

router.get('/', jwtAuthenticate, profilesCtrl.getProfile);

router.put('/', jwtAuthenticate, profilesCtrl.updateProfile);

// get Public profile
router.get('/:userId', profilesCtrl.getPublicProfile);

module.exports = router;
