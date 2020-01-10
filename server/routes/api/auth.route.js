const express = require('express');
const userCtrl = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/signup', userCtrl.signUp);

module.exports = router;
