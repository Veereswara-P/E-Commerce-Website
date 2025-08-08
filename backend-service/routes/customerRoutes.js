const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

router.put('/:id', customerController.updateCustomer);

module.exports = router;
