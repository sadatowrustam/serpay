const express = require('express');
const {
    addSubcategory,
    editSubcategory,
    deleteSubcategory,
    getOne
} = require('../../../controllers/admin/subcategoriesControllers');

const router = express.Router();
router.get("/get-one/:id", getOne)
router.post('/add', addSubcategory);
router.patch('/:id', editSubcategory);
router.delete('/:id', deleteSubcategory);

module.exports = router;