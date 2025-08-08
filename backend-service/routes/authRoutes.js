// routes/authRoutes.js

const express = require('express');
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth'); // Import auth middleware
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getMe);

// Add this new route for updating the profile
router.patch('/profile', auth, updateProfile);

module.exports = router;
