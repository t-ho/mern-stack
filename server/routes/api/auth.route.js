const express = require('express');
const authCtrl = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/reset-password/:token', authCtrl.resetPassword);

router.post('/send-token', authCtrl.sendToken);

router.post('/signin', authCtrl.signIn);

router.post('/signup', authCtrl.signUp);

router.post('/verify-email/:token', authCtrl.verifyEmail);

module.exports = router;
