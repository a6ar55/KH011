// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../controllers/authController');

// Route for user authentication
router.post('/authenticate', authenticateUser);

module.exports = router;

