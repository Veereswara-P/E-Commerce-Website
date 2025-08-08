// backend-service/controllers/searchController.js
const pool = require('../config/db');

exports.searchAll = async (req, res) => {
  const { q } = req.query; // The search query, e.g., /api/search?q=laptop

  if (!q) {
    return res.status(400).json({ error: 'Search query "q" is required.' });
  }

  try {
    const searchQuery = `%${q}%`; // Add wildcards for partial matching

    // Search for matching products (by name or description)
    const productPromise = pool.query(
      "SELECT *, category_image_url as image_url FROM products WHERE product_name ILIKE $1 OR product_description ILIKE $1",
      [searchQuery]
    );

    // Search for matching categories (by name)
    const categoryPromise = pool.query(
      "SELECT * FROM categories WHERE category_name ILIKE $1",
      [searchQuery]
    );

    // Run both queries in parallel for efficiency
    const [productResult, categoryResult] = await Promise.all([
      productPromise,
      categoryPromise,
    ]);

    // Return a structured response
    res.json({
      products: productResult.rows,
      categories: categoryResult.rows,
    });

  } catch (err) {
    console.error("Global search error:", err.message);
    res.status(500).json({ error: 'An error occurred during the search.' });
  }
};
