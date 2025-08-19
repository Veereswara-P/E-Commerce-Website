const pool = require('../config/db');
const { sendSuccess } = require('../utils/responseHandler');

exports.getCategories = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
         category_id, 
         category_name, 
         category_image_url 
       FROM categories 
       ORDER BY category_id ASC`
    );
    sendSuccess(res, 200, rows);
  } catch (err) {
    next(err);
  }
};

exports.getSubcategoriesByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY subcategories_name ASC',
      [categoryId]
    );
    sendSuccess(res, 200, rows);
  } catch (err) {
    next(err);
  }
};