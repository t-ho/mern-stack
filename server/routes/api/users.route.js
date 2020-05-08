const express = require('express');
const usersCtr = require('../../controllers/users.controller');
const createAuthStrategy = require('../../middleware/createAuthStrategy');
const createCan = require('../../middleware/createCan');

const router = express.Router();
const jwtAuthenticate = createAuthStrategy('jwt');
const canDeleteUsers = createCan('deleteUsers');
const canReadUsers = createCan('readUsers');
const canUpdateUsers = createCan('updateUsers');

router.use(jwtAuthenticate);

// Preload user object on routes with ':userId'
router.param('userId', usersCtr.preloadTargetUser);

router.get('/', canReadUsers, usersCtr.getUsers);

router.get('/:userId', canReadUsers, usersCtr.getUser);

router.put('/:userId', canUpdateUsers, usersCtr.updateUser);

router.delete('/:userId', canDeleteUsers, usersCtr.deleteUser);

module.exports = router;
