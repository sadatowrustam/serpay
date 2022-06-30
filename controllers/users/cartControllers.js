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
    const { product_id, product_size_id, quantity } = req.body;
    var orderProductData = {}
    let product = await Products.findOne({ where: { product_id }, include: { model: Images, as: "images" } })
    if (!product) return next(new AppError("Product not found with that id", 404))
    if (product_size_id) {
        let productsize = await Productsizes.findOne({
            where: { product_size_id },
            include: [{
                    model: Stock,
                    as: "product_size_stock"
                },
                {
                    model: Productcolor,
                    as: "product_color"
                },
                {
                    model: Products,
                    as: "main_product"
                }

            ]
        })
        orderProductData.price = productsize.price
        if (quantity > productsize.product_size_stock.quantity) {
            quantity = productsize.product_size_stock.quantity
        }
        if (productsize.product_color != null) {
            var productColor = await Productcolor.findOne({ where: { product_color_id }, include: { model: Images, as: "product_images" } })
            orderProductData.image = productColor.product_images[0].image
        } else orderProductData.image = product.images[0].image
        orderProductData.size = productsize.size
        orderProductData.quantity = quantity
        orderProductData.total_price = quantity * productsize.price
        orderProductData.userId = req.user.id
        orderProductData.is_ordered = false
    } else if (product_id) {
        let product = await Products.findOne({ where: { product_id }, include: { model: Stock, as: "product_stock" } })
        if (!product) return next(new AppError("Product not found with that id", 404))
        if (quantity > product.stock.quantity) {
            quantity = product.stock.quantity
        }
        orderProductData.price = product.price

    }
    orderProductData.productId = product.id
    console.log(orderProductData)
    const order_product = await Orderproducts.create(orderProductData)
    return res.status(201).send(order_product)
})