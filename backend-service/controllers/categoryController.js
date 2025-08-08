// backend-service/controllers/categoryController.js
const pool = require('../config/db');

/**
 * Gets all categories from the database.
 */
exports.getCategories = async (req, res) => {
  try {
    // --- THE FINAL FIX ---
    // The CONVERT_FROM function must operate on the actual binary 'bytea' column.
    // The correct column is "category_image_url" (with one underscore).
    // This converts the binary data into a plain text string that the browser can use.
    const { rows } = await pool.query(
      `SELECT 
         category_id, 
         category_name, 
         CONVERT_FROM(category_image_url, 'UTF8') AS image_url 
       FROM categories 
       ORDER BY category_id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Categories Error:", err.message);
    res.status(500).json({ error: 'Failed to convert category image data. Please check the database content.' });
  }
};

/**
 * Gets all subcategories for a given category ID.
 */
exports.getSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY subcategories_name ASC',
      [categoryId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Subcategories Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
