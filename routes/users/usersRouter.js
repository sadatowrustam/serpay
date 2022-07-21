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
    getNotOrderedProducts,
    select
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
    deleteCompetitor,
    likeProduct,
    dislikeProduct,
    getLikedProducts,
} = require('../../controllers/users/usersControllers');
const router = express.Router();
router.patch('/forgot-password', verify_code_forgotten, forgotPassword);
router.post('/signup', verify_code, signup);
router.post('/login', login);
router.post("/address", protect, addMyAddress)
router.get("/address", protect, getAllAddress)
router.patch("/address/:id", protect, editMyAddress)
router.get("/address/:id", protect, getAddress)
router.delete("/address/:id", protect, deleteMyAddress)
router.get('/my-account', protect, getMe);
router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);
router.patch('/update-my-password', protect, updateMyPassword);
router.post("/history", protect, addMyHistory)
router.get("/history", protect, getAllHistory)
router.delete("/history/:id", protect, deleteMyHistory)
router.get('/my-cart', protect, getMyCart);
router.post("/my-cart/select/:id", protect, select)
router.post("/to-my-cart", protect, addMyCart)
router.get('/my-orders', protect, getMyOrders);
router.get('/my-order-products/:id', protect, getMyOrderProducts);
router.get("/not-ordered", protect, getNotOrderedProducts)
router.post('/my-orders/add', protect, addMyOrders);
router.post("/competition/add", protect, enterToCompetition)
router.post("/competition/add-one", protect, addOne)
router.delete("/competition/:id", protect, deleteCompetitor)
router.get("/like", protect, getLikedProducts)
router.post("/like", protect, likeProduct)
router.delete("/like/:id", protect, dislikeProduct)
module.exports = router;