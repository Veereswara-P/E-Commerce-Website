const pool = require('../config/db');

// Gets all wishlist items for the logged-in user
exports.getWishlist = async (req, res) => {
  const customerId = req.user.id;
  try {
    // Join with the products table to get full product details
    const { rows } = await pool.query(
      `SELECT p.*, p.category_image_url as image_url FROM wishlist_items w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.customer_id = $1`,
      [customerId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Wishlist Error:", err.message);
    res.status(500).json({ error: 'Failed to retrieve wishlist.' });
  }
};

// Adds a product to the user's wishlist
exports.addToWishlist = async (req, res) => {
  const customerId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }

  try {
    // Use ON CONFLICT to avoid errors if the item is already in the wishlist
    const { rows } = await pool.query(
      'INSERT INTO wishlist_items (customer_id, product_id) VALUES ($1, $2) ON CONFLICT (customer_id, product_id) DO NOTHING RETURNING *',
      [customerId, productId]
    );
    res.status(201).json(rows[0] || { msg: 'Item already in wishlist.' });
  } catch (err) {
    console.error("Add to Wishlist Error:", err.message);
    res.status(500).json({ error: 'Failed to add item to wishlist.' });
  }
};

// Removes a product from the user's wishlist
exports.removeFromWishlist = async (req, res) => {
  const customerId = req.user.id;
  const { productId } = req.params; // From URL: /api/wishlist/some-product-id

  try {
    await pool.query(
      'DELETE FROM wishlist_items WHERE customer_id = $1 AND product_id = $2',
      [customerId, productId]
    );
    res.status(200).json({ msg: 'Item removed from wishlist.' });
  } catch (err) {
    console.error("Remove from Wishlist Error:", err.message);
    res.status(500).json({ error: 'Failed to remove item from wishlist.' });
  }
};
