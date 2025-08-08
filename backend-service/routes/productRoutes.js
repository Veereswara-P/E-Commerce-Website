const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
