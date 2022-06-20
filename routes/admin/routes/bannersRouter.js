const express = require('express');
const {
    uploadBannerImage,
    addBanner,
    deleteBanner,
    editBanner
} = require('../../../controllers/admin/bannerControllers');
const {
    getAllBanners,
    getBanner,
} = require('../../../controllers/public/bannerControllers');
const { protect } = require("../../../controllers/admin/adminControllers")
const router = express.Router();

router.get('/', getAllBanners);
router.get('/:id', getBanner);
router.post('/add', protect, addBanner);
router.patch("/:id", protect, editBanner)

router.delete('/:id', protect, deleteBanner);
router.post('/upload-image/:id', protect, uploadBannerImage);

module.exports = router;