// backend-service/controllers/productController.js
const pool = require('../config/db');

/**
 * Gets a list of products with filtering, sorting, and pagination.
 */
exports.getProducts = async (req, res) => {
  const { search, category_id, subcategory_id, page = 1, limit = 10, sort, minPrice, maxPrice } = req.query;
  const offset = (page - 1) * limit;

  try {
    let queryParams = [];
    let whereClauses = [];

    // --- Build filtering conditions using NEW column names ---
    if (search) {
      queryParams.push(`%${search}%`);
      whereClauses.push(`product_name ILIKE $${queryParams.length}`); // Use "product_name"
    }
    if (category_id) {
      queryParams.push(category_id);
      whereClauses.push(`category_id = $${queryParams.length}`);
    }
    if (subcategory_id) {
      queryParams.push(subcategory_id);
      whereClauses.push(`subcategory_id = $${queryParams.length}`);
    }
    if (minPrice) {
      queryParams.push(minPrice);
      whereClauses.push(`product_price >= $${queryParams.length}`); // Use "product_price"
    }
    if (maxPrice) {
      queryParams.push(maxPrice);
      whereClauses.push(`product_price <= $${queryParams.length}`); // Use "product_price"
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // --- Determine sort order using NEW column names ---
    let orderByClause = 'ORDER BY product_name ASC'; // Default sort
    if (sort === 'price_asc') orderByClause = 'ORDER BY product_price ASC';
    if (sort === 'price_desc') orderByClause = 'ORDER BY product_price DESC';

    // --- Get total count for pagination ---
    const totalResult = await pool.query(`SELECT COUNT(*) FROM products ${whereClause}`, queryParams);
    const totalItems = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    // Add limit and offset for the final query
    queryParams.push(limit, offset);

    // --- Fetch products for the current page ---
    const productsResult = await pool.query(
      `SELECT * FROM products ${whereClause} ${orderByClause} LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams
    );

    res.json({
      products: productsResult.rows,
      totalPages,
    });
  } catch (err) {
    console.error("Get Products Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Gets a single product by its ID.
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // --- Use the correct column name "product_id" ---
    const { rows } = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Get Product By ID Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
