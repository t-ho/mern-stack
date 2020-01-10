const express = require('express');

const router = express.Router();

router.get('/alive', (req, res) => {
  res.status(200).json({ status: 'pass' });
});

module.exports = router;
