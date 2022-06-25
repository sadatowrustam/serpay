const express = require('express');
const {
    addColor,
    editColor,
    uploadColorImage
} = require('../../../controllers/admin/colorsControllers');
const {
    getAllColors,
} = require('../../../controllers/public/colorsControllers');
const router = express.Router();
router.get('/', getAllColors);
router.post('/add', addColor);
router.patch('/:id', editColor);
router.post('/upload-image/:id', uploadColorImage);

module.exports = router;