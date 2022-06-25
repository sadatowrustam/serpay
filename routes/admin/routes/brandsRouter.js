const express = require('express');
const {
    addBrand,
    editBrand,
    deleteBrand,
    uploadBrandImage,
    addBrandCategory,
    deleteBrandCategory,
} = require('../../../controllers/admin/brandsControllers');
const {
    getAllBrands,
} = require('../../../controllers/public/brandsControllers');
const router = express.Router();
router.get('/', getAllBrands);
router.post('/add', addBrand);
router.post('/add-category/:id', addBrandCategory);
router.patch('/:id', editBrand);
router.delete('/:id', deleteBrand);
router.delete('/delete-category', deleteBrandCategory);
router.post('/upload-image/:id', uploadBrandImage);
module.exports = router;