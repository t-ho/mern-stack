const express = require('express');
const passport = require('passport');
const userCtr = require('../../controllers/user.controller');
const createCan = require('../../middleware/createCan');

const router = express.Router();
const canDeleteUsers = createCan('deleteUsers');
const canReadUsers = createCan('readUsers');

router.use(passport.authenticate('jwt', { session: false }));

// Preload user object on routes with ':userId'
router.param('userId', userCtr.preloadTargetUser);

router.get('/', canReadUsers, userCtr.getUsers);

router.delete('/:userId', canDeleteUsers, userCtr.deleteUser);

module.exports = router;
