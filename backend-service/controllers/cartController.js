const pool = require('../config/db');

/**
 * Adds an item to the cart. If the item already exists, its quantity is increased.
 * It also checks against the product's stock quantity.
 */
exports.addToCart = async (req, res) => {
  const { productId, product_quantity = 1 } = req.body;
  const customerId = req.user.id;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }

  try {
    // 1. Get current stock and cart quantity
    const productQuery = 'SELECT product_stock_quantity FROM products WHERE product_id = $1';
    const productResult = await pool.query(productQuery, [productId]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const stockQuantity = productResult.rows[0].product_stock_quantity;

    const cartQuery = 'SELECT product_quantity FROM cart WHERE customer_id = $1 AND product_id = $2';
    const cartResult = await pool.query(cartQuery, [customerId, productId]);
    const currentCartQuantity = cartResult.rows.length > 0 ? cartResult.rows[0].product_quantity : 0;

    // 2. Check if the new quantity exceeds stock
    if ((currentCartQuantity + product_quantity) > stockQuantity) {
      return res.status(400).json({ error: 'Cannot add more items than available in stock.' });
    }

    // 3. Proceed with adding to cart
    const { rows } = await pool.query(
      `INSERT INTO cart (customer_id, product_id, product_quantity) VALUES ($1, $2, $3)
       ON CONFLICT (customer_id, product_id) DO UPDATE
       SET product_quantity = cart.product_quantity + EXCLUDED.product_quantity
       RETURNING *`,
      [customerId, productId, product_quantity]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ error: 'An error occurred while managing the cart.' });
  }
};

/**
 * Gets all items in the cart for the logged-in customer.
 */
exports.getCart = async (req, res) => {
  const customerId = req.user.id;
  try {
    const { rows } = await pool.query(
      `SELECT p.product_id, p.product_name, p.product_price, p.product_stock_quantity, p.category_image_url AS image_url, c.product_quantity
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.customer_id = $1`,
      [customerId]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ error: 'Failed to retrieve cart items.' });
  }
};

/**
 * Decreases an item's quantity. If quantity becomes 1, it removes the item.
 */
exports.decreaseQuantity = async (req, res) => {
  const { productId } = req.params;
  const customerId = req.user.id;

  try {
    const cartItem = await pool.query(
      'SELECT product_quantity FROM cart WHERE customer_id = $1 AND product_id = $2',
      [customerId, productId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found in cart.' });
    }

    if (cartItem.rows[0].product_quantity > 1) {
      const updatedItem = await pool.query(
        'UPDATE cart SET product_quantity = product_quantity - 1 WHERE customer_id = $1 AND product_id = $2 RETURNING *',
        [customerId, productId]
      );
      res.status(200).json(updatedItem.rows[0]);
    } else {
      await pool.query(
        'DELETE FROM cart WHERE customer_id = $1 AND product_id = $2',
        [customerId, productId]
      );
      res.status(200).json({ msg: 'Item removed from cart.' });
    }
  } catch (err) {
    console.error("Decrease quantity error:", err.message);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
};


/**
 * Removes an item completely from the cart.
 */
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const customerId = req.user.id;
  try {
    await pool.query(
      'DELETE FROM cart WHERE customer_id = $1 AND product_id = $2',
      [customerId, productId]
    );
    res.status(200).json({ msg: 'Item removed from cart.' });
  } catch (err) {
    console.error("Remove from cart error:", err.message);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
};

/**
 * Clears all items from the user's cart.
 */
exports.clearCart = async (req, res) => {
  const customerId = req.user.id;
  try {
    await pool.query('DELETE FROM cart WHERE customer_id = $1', [customerId]);
    res.status(200).json({ msg: 'Cart cleared.' });
  } catch (err) {
    console.error("Clear cart error:", err.message);
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
};