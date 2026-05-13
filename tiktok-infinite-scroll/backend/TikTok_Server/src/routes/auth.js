const express = require('express');
const router = express.Router();
const { signup, login, testConnection } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/test-connection', testConnection);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router;