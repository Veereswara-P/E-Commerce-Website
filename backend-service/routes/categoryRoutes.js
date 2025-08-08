const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/subcategories/:categoryId', categoryController.getSubcategoriesByCategoryId);

module.exports = router;
