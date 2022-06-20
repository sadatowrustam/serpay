const express = require('express');
const {
    searchProducts,
    getOneProduct,
    discount,
    newProducts
} = require('../../../controllers/public/productsControllers');

const router = express.Router();
router.get("/")
router.get('/search', searchProducts);
router.get("/discount", discount)
router.get("/new", newProducts)
router.get("/:id", getOneProduct)
router.post("/set-rating/:id")

module.exports = router;