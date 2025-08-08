// backend-service/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchAll } = require('../controllers/searchController');

// GET /api/search?q=...
router.get('/', searchAll);

module.exports = router;
