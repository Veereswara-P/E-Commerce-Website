const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/auth');
const { validate, wishlistItemSchema } = require('../middleware/validation');

// All wishlist routes are protected and require a user to be logged in
router.use(auth);

// Handle GET requests to /api/wishlist
router.get('/', getWishlist);

// Handle POST requests to /api/wishlist
// Apply validation middleware to the addToWishlist route
router.post('/', validate(wishlistItemSchema), addToWishlist);

// Handle DELETE requests to /api/wishlist/:productId
router.delete('/:productId', removeFromWishlist);

module.exports = router;