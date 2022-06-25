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
    addSizeToColor,
    editColor,
    deleteProductColor
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
router.patch('/:id', protect, editProduct);
router.patch("/size/:id", protect, editSize)
router.patch('/edit-status/:id', protect, editProductStatus);
router.delete('/:id', deleteProduct);
router.delete("/color/:id", deleteProductColor)
router.post('/upload-image/:id', uploadProductImage);
router.post("/upload-image/by-color/:id", uploadProductImagebyColor)
module.exports = router;