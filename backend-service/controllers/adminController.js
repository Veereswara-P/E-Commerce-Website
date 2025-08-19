const pool = require('../config/db');
const { sendSuccess } = require('../utils/responseHandler');
const { BadRequestError, NotFoundError } = require('../utils/customErrors');

exports.createProduct = async (req, res, next) => {
    try {
        const {
            product_name, product_description, product_price, category_image_url,
            product_stock_quantity, category_id, subcategory_id, customer_gender,
            category_name, subcategory_name
        } = req.body;

        if (!product_name || !product_price || !product_stock_quantity || !category_id) {
            throw new BadRequestError('Name, price, stock, and category ID are required.');
        }

        const { rows } = await pool.query(
            `INSERT INTO products (
                product_name, product_description, product_price, category_image_url, 
                product_stock_quantity, category_id, subcategory_id, customer_gender, 
                category_name, subcategory_name
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                product_name, product_description, product_price, category_image_url,
                product_stock_quantity, category_id, subcategory_id, customer_gender,
                category_name, subcategory_name
            ]
        );
        sendSuccess(res, 201, rows[0], 'Product created successfully.');
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fields = req.body;

        const setClauses = Object.keys(fields).map((key, index) => {
            return `${key} = $${index + 1}`;
        }).join(', ');

        if (!setClauses) {
            throw new BadRequestError('No fields provided to update.');
        }

        const values = Object.values(fields);

        const { rows } = await pool.query(
            `UPDATE products SET ${setClauses} WHERE product_id = $${values.length + 1} RETURNING *`,
            [...values, id]
        );

        if (rows.length === 0) {
            throw new NotFoundError('Product not found.');
        }

        sendSuccess(res, 200, rows[0], 'Product updated successfully.');
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM products WHERE product_id = $1', [id]);

        if (rowCount === 0) {
            throw new NotFoundError('Product not found.');
        }

        sendSuccess(res, 200, null, 'Product deleted successfully.');
    } catch (err) {
        next(err);
    }
};