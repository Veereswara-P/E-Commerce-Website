// routes/authRoutes.js
const express = require('express');
const { register, login, logout, getMe, updateProfile, deleteUser } = require('../controllers/authController');
// Import the new schema
const { validate, registerSchema, loginSchema, updateProfileSchema } = require('../middleware/validation');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', auth, getMe);

// Apply the validation middleware to the profile update route
router.patch('/profile', auth, validate(updateProfileSchema), updateProfile);

router.delete('/profile', auth, deleteUser);

module.exports = router;