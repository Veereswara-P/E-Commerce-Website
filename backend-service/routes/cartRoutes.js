const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const { validate, cartItemSchema } = require('../middleware/validation');

// Apply auth middleware to all cart routes
router.use(auth);

// GET /api/cart - Get all items in the cart
router.get('/', cartController.getCart);

// POST /api/cart - Add an item to the cart
// Apply validation middleware to the addToCart route
router.post('/', validate(cartItemSchema), cartController.addToCart);

// PUT /api/cart/decrease/:productId - Decrease an item's quantity
router.put('/decrease/:productId', cartController.decreaseQuantity);

// DELETE /api/cart - Clear the entire cart
router.delete('/', cartController.clearCart);

// DELETE /api/cart/:productId - Remove a single item from the cart
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;