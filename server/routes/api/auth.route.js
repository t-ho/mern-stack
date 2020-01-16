const express = require('express');
const authCtrl = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/signin', authCtrl.signIn);

router.post('/signup', authCtrl.signUp);

router.post('/verify/:validationToken', authCtrl.verifyEmail);

module.exports = router;
