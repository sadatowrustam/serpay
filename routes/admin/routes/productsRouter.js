const express = require('express');
const {
    addProduct,
    editProduct,
    uploadProductImage,
    deleteProduct,
    editProductStatus,
    getAllActiveProducts,
    getAllNonActiveProducts,
    getOneProduct,
    uploadProductImagebyColor,
    addColor,
    addSize,
    editSize,
    editColor
} = require('../../../controllers/admin/productsControllers');
const { login, protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();

router.get('/', getAllActiveProducts);
router.get('/non-active', getAllNonActiveProducts);
router.get("/:product_id", getOneProduct)
router.post("/add", addProduct)
router.post("/add/size/:id", addSize)
router.post("/add/color/:id", addColor)
router.patch("/color/:id", editColor)
router.patch('/:id', editProduct);
router.patch("/size/:id", editSize)
router.patch('/edit-status/:id', editProductStatus);
router.delete('/:id', deleteProduct);
router.post('/upload-image/:id', uploadProductImage);
router.post("/upload-image/by-color/:id", uploadProductImagebyColor)

module.exports = router;