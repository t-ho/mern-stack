const express = require('express');
const authCtrl = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/signin', authCtrl.signIn);

router.post('/signup', authCtrl.signUp);

module.exports = router;
