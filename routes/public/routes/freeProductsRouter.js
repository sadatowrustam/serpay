const express = require('express');
const {
    getAllFreeProducts,
} = require('../../../controllers/public/freeProductsControllers');

const router = express.Router();

router.get('/', getAllFreeProducts);

module.exports = router;