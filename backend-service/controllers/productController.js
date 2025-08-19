const pool = require('../config/db');
const { NotFoundError, BadRequestError } = require('../utils/customErrors');
const { sendSuccess } = require('../utils/responseHandler');

const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

exports.getProducts = async (req, res, next) => {
  const { search, category_id, subcategory_id, page = 1, limit = 10, sort, minPrice, maxPrice } = req.query;
  const offset = (page - 1) * limit;

  try {
    let queryParams = [];
    let whereClauses = [];

    if (search) queryParams.push(`%${search}%`), whereClauses.push(`product_name ILIKE $${queryParams.length}`);
    if (category_id) queryParams.push(category_id), whereClauses.push(`category_id = $${queryParams.length}`);
    if (subcategory_id) queryParams.push(subcategory_id), whereClauses.push(`subcategory_id = $${queryParams.length}`);
    if (minPrice) queryParams.push(minPrice), whereClauses.push(`product_price >= $${queryParams.length}`);
    if (maxPrice) queryParams.push(maxPrice), whereClauses.push(`product_price <= $${queryParams.length}`);

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    let orderByClause = 'ORDER BY product_name ASC';
    if (sort === 'price_asc') orderByClause = 'ORDER BY product_price ASC';
    if (sort === 'price_desc') orderByClause = 'ORDER BY product_price DESC';

    const totalResult = await pool.query(`SELECT COUNT(*) FROM products ${whereClause}`, queryParams);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    queryParams.push(limit, offset);
    
    const productsResult = await pool.query(
      `SELECT product_id, product_name, product_description, product_price, category_image_url, product_stock_quantity, product_created_at, category_id, subcategory_id, customer_gender, category_name, subcategory_name 
       FROM products 
       ${whereClause} ${orderByClause} 
       LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams
    );

    sendSuccess(res, 200, {
      products: productsResult.rows,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isUuid.test(id)) {
      throw new BadRequestError('Invalid product ID format.');
    }
    
    const { rows } = await pool.query(
        `SELECT product_id, product_name, product_description, product_price, category_image_url, product_stock_quantity, product_created_at, category_id, subcategory_id, customer_gender, category_name, subcategory_name
         FROM products WHERE product_id = $1`, 
        [id]
    );

    if (rows.length === 0) {
      throw new NotFoundError('Product not found');
    }
    sendSuccess(res, 200, rows[0]);
  } catch (err) {
    next(err);
  }
};