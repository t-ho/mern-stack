const express = require('express');
const passport = require('passport');

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/', function(req, res) {
  res.json({ message: 'FIXME: You are authenticated' });
});

module.exports = router;
