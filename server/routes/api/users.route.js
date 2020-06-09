const express = require('express');
const usersCtr = require('../../controllers/users.controller');
const createAuthStrategy = require('../../middleware/createAuthStrategy');
const createCan = require('../../middleware/createCan');

const router = express.Router();
const jwtAuthenticate = createAuthStrategy('jwt');
const canReadUsers = createCan('usersRead');
const canModifyUsers = createCan('usersModify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':userId'
router.param('userId', usersCtr.preloadTargetUser);

router.get('/', canReadUsers, usersCtr.getUsers);

router.get('/:userId', canReadUsers, usersCtr.getUser);

router.put('/:userId', canModifyUsers, usersCtr.updateUser);

router.delete('/:userId', canModifyUsers, usersCtr.deleteUser);

module.exports = router;
