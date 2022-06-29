const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Products, Stock, Orderproducts, Productcolor, Productsizes, Sizes, Images } = require('../../models');

exports.getMyCart = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20
    const offset = req.query.offset
    const my_cart = await Orderproducts.findAll({ where: { userId: req.user.id, is_ordered: false } }, limit, offset)
    return res.status(200).send(my_cart);
});
exports.addMyCart = catchAsync(async(req, res, next) => {
    const { product_id, product_color_id, product_size_id, quantity } = req.body;
    var orderProductData = {}
    let product = await Products.findOne({ where: { product_id } })
    if (!product) return next(new AppError("Product not found with that id", 404))
    if (product_size_id) {
        let productsize = await Productsizes.findOne({
            where: { product_size_id },
            include: [{
                    model: Stock,
                    as: "product_size_stock"
                },

            ]
        })
        if (quantity > productsize.product_size_stock.quantity) {
            quantity = productsize.product_size_stock.quantity
        }

        let productColor = await Productcolor.findOne({ where: { product_color_id }, include: { model: Images, as: "product_images" } })
        orderProductData.size = productsize.size
        orderProductData.quantity = quantity
        orderProductData.image = productColor.image[0].image
        orderProductData.userId = req.user.id
        orderProductData.is_ordered = false
    } else {
        let product = await Products.findOne({ where: { product_id }, include: { model: Stock, as: "product_stock" } })
        if (!product) return next(new AppError("Product not found with that id", 404))
        if (quantity > product.stock.quantity) {
            quantity = product.stock.quantity
        }
        orderProductData.productId = product.id
    }
    const order_product = await Orderproducts.create(orderProductData)
    return res.status(201).send(order_product)
})