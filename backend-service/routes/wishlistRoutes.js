const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/auth'); // Your authentication middleware

// All wishlist routes are protected and require a user to be logged in
router.use(auth);

// Handle GET requests to /api/wishlist
router.get('/', getWishlist);

// Handle POST requests to /api/wishlist
router.post('/', addToWishlist);

// Handle DELETE requests to /api/wishlist/:productId
router.delete('/:productId', removeFromWishlist);

module.exports = router;
