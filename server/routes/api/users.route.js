const express = require('express');
const usersCtr = require('../../controllers/users.controller');
const createAuthenticationStrategy = require('../../middleware/createAuthenticationStrategy');
const createUserAuthorizationMiddleware = require('../../middleware/createUserAuthorizationMiddleware');

const router = express.Router();
const jwtAuthenticate = createAuthenticationStrategy('jwt');
const canReadUser = createUserAuthorizationMiddleware('read');
const canModifyUser = createUserAuthorizationMiddleware('modify');

router.use(jwtAuthenticate);

// Preload user object on routes with ':userId'
router.param('userId', usersCtr.preloadTargetUser);

router.get('/', canReadUser, usersCtr.getUsers);

router.get('/:userId', canReadUser, usersCtr.getUser);

router.put('/:userId', canModifyUser, usersCtr.updateUser);

router.delete('/:userId', canModifyUser, usersCtr.deleteUser);

module.exports = router;
