const express = require('express');
const authRoutes = require('./auth.route');

const router = express.Router();

router.get('/alive', (req, res) => {
  res.status(200).json({ status: 'pass' });
});

router.use('/auth', authRoutes);

module.exports = router;
