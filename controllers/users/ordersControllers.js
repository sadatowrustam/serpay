const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Products, Orders, Orderproducts, Productsizes, Productcolor } = require('../../models');

exports.addMyOrders = catchAsync(async(req, res, next) => {
    var {
        userId,
        address,
        order_products,
        delivery_time,
        payment_type,
        user_name,
        user_phone,
        i_take,
        note,
    } = req.body;
    let checkedProducts = [];
    let total_price = 0;
    let total_quantity = 0;
    if (order_products)
        for (var i = 0; i < order_products.length; i++) {
            if (order_products[i].product_size_id) {
                var product = await Productsizes.findOne({ where: { product_size_id: order_products[i].product_size_id } })
            } else {
                var product = await Products.findOne({
                    where: { product_id: order_products[i].product_id },
                });
            }
            if (!product)
                return next(
                    new AppError(
                        `Product did not found with your ID index: ${i + 1}`,
                        404
                    )
                );

            checkedProducts.push(product);
            total_quantity = total_quantity + order_products[i].quantity;
            total_price =
                total_price + product.product_price * order_products[i].quantity;
        }
    const order = await Orders.create({
        userId,
        total_price,
        address,
        user_name,
        user_phone,
        payment_type,
        i_take,
        note,
        status: 0,
        delivery_time,
        total_quantity,
    });
    for (var i = 0; i < checkedProducts.length; i++) {
        if (checkedProducts[i].product_size_id) {
            var checkedProduct = await Productsizes.findOne({ where: { product_size_id: checkedProducts[i].product_size_id } })
        } else {
            var checkedProduct = await Products.findOne({ where: { product_size_id: checkedProducts[i].product_id } })
        }
        await Orderproducts.update({
            orderId: order.id,
            productId: order_products[i].product_id,
            product_size: checkedProducts[i].size || "-",
            quantity: order_products[i].quantity,
            price: checkedProducts[i].product_price,
            total_price: Number(checkedProducts[i].product_price * order_products[i].quantity),
        }, {
            where: {
                orderproduct_id: order_products[i].orderproduct_id,
                userId: req.user.id
            }
        });
    }
    return res.status(200).json({
        status: 'Your orders accepted and will be delivered as soon as possible',
        data: {
            order,
        },
    });
});
exports.getMyOrders = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;

    const orders = await Orders.findAll({
        where: { userId: req.user.id },
        order: [
            ['updatedAt', 'DESC']
        ],
        limit,
        offset,
    });

    res.status(200).send(orders);
});
exports.getMyOrderProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const order = await Orders.findOne({
        where: { order_id: req.params.id },
        include: {
            model: Orderproducts,
            as: 'order_products',
            order: [
                ['updatedAt', 'DESC']
            ],
            limit,
            offset,
        },
    });

    if (!order)
        return next(new AppError(`Order did not found with that ID`, 404));

    let orderProducts = [];

    for (var i = 0; i < order.order_products.length; i++) {
        const product = await Products.findOne({
            where: { product_id: order.order_products[i].productId },
        });

        if (!product)
            return next(
                new AppError(`Product did not found with your ID : ${i} `, 404)
            );

        const {
            product_id,
            product_code,
            product_name_tm,
            product_name_ru,
            product_description_tm,
            product_description_ru,
            product_preview_image,
            product_image,
        } = product;

        const obj = {
            product_id,
            product_code,
            product_name_tm,
            product_name_ru,
            product_description_tm,
            product_description_ru,
            product_preview_image,
            product_image,
            quantity: order.order_products[i].quantity,
            order_price: order.order_products[i].price,
            total_price: order.order_products[i].total_price,
        };

        orderProducts.push(obj);
    }

    res.status(200).send(orderProducts);
});