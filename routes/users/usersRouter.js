const express = require('express');
const {
    login,
    signup,
    forgotPassword,
    protect,
    verify_code,
    verify_code_forgotten,
} = require('../../controllers/users/authController');
const { getMyCart, addMyCart } = require('../../controllers/users/cartControllers');
const {
    addMyOrders,
    getMyOrders,
    getMyOrderProducts,
} = require('../../controllers/users/ordersControllers');
const {
    getMe,
    updateMyPassword,
    updateMe,
    deleteMe,
    addMyAddress,
    editMyAddress,
    getAddress,
    deleteMyAddress,
    getAllAddress,
    getAllHistory,
    addMyHistory,
    deleteMyHistory,
    enterToCompetition,
    addOne,
    deleteCompetitor
} = require('../../controllers/users/usersControllers');
const router = express.Router();
router.patch('/forgot-password', verify_code_forgotten, forgotPassword);
router.post('/signup', verify_code, signup);
router.post('/login', login);
router.post("/address", protect, addMyAddress)
router.get("/address", getAllAddress)
router.patch("/address/:id", editMyAddress)
router.get("/address/:id", getAddress)
router.delete("/address/:id", deleteMyAddress)
router.get('/my-account', protect, getMe);
router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);
router.patch('/update-my-password', protect, updateMyPassword);
router.post("/history", addMyHistory)
router.get("/history", getAllHistory)
router.delete("/history/:id", deleteMyHistory)
router.post('/my-cart', getMyCart);
router.post("/to-my-cart", addMyCart)
router.get('/my-orders', protect, getMyOrders);
router.get('/my-order-products/:id', protect, getMyOrderProducts);
router.post('/my-orders/add', protect, addMyOrders);
router.post("/competition/add", protect, enterToCompetition)
router.post("/competition/add-one", protect, addOne)
router.delete("/competition/:id", protect, deleteCompetitor)
module.exports = router;