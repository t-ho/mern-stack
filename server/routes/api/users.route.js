const express = require('express');
const passport = require('passport');
const userCtr = require('../../controllers/user.controller');
const createCan = require('../../middleware/createCan');

const router = express.Router();
const canReadUsers = createCan('readUsers');

router.use(passport.authenticate('jwt', { session: false }));

router.get('/', canReadUsers, userCtr.getUsers);

module.exports = router;
