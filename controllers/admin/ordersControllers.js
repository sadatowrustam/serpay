const Op = require('sequelize').Op;
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {
    Seller,
    Products,
    Orders,
    Orderproducts,
    Stock,
} = require('../../models');

exports.getAllOrders = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    let { page, id, user_phone, status } = req.query;
    let offset = (page - 1) * limit
    var where = {};

    if (user_phone) {
        user_phone = '+' + user_phone;
        where.user_phone = user_phone;
        if (status) where.status = status;
        if (id) where.id = id;
    }
    const orders = await Orders.findAll({
        where,
        order: [
            ['updatedAt', 'DESC']
        ],
        limit,
        offset,
    });
    const count = await Orders.count()
    return res.status(201).send({ orders, count });
});

exports.getOrderProducts = catchAsync(async(req, res, next) => {
    const order = await Orders.findOne({
        where: { order_id: req.params.id },
        include: {
            model: Orderproducts,
            as: 'order_products',
        },
    });
    if (!order) {
        return next(new AppError('Order did not found with that ID', 404));
    }

    let orderProducts = [];
    for (var i = 0; i < order.order_products.length; i++) {
        const product = await Products.findOne({
            where: { product_id: order.order_products[i].productId },
            include: {
                model: Seller,
                as: "seller_product"
            },
        });
        if (!product)
            return next(
                new AppError(`Product did not found with your ID : ${i} `, 404)
            );
        const {
            product_id,
            name_tm,
            name_ru,
            name_en,
            body_tm,
            body_ru,
            body_en,
            price,
            image,
            sellerId
        } = product;
        const obj = {
            product_id,
            name_tm,
            name_ru,
            name_en,
            body_tm,
            body_ru,
            body_en,
            image,
            price,
            quantity: order.order_products[i].quantity,
            order_price: order.order_products[i].price,
            total_price: order.order_products[i].total_price,
        };
        if (sellerId) {
            const seller = await Seller.findOne({ where: { id: sellerId } })
            obj.sellerName = seller.name
        }

        orderProducts.push(obj);
    }

    return res.status(201).send(orderProducts);
});

exports.changeOrderStatus = catchAsync(async(req, res, next) => {
    const order = await Orders.findOne({
        where: {
            order_id: req.params.id,
        },
        include: {
            model: Orderproducts,
            as: 'order_products',
        },
    });

    if (!order) {
        return next(new AppError('Order did not found with that ID', 404));
    }

    if (req.body.status == "gowshuryldy") {
        for (var i = 0; i < order.order_products.length; i++) {
            const product = await Products.findOne({
                where: { product_id: order.order_products[i].productId, sellerId: null },
            });
            const stock = await Stock.findOne({ where: { productId: product.id } });
            console.log(stock)
            await stock.update({
                stock_quantity: stock.stock_quantity - order.order_products[i].quantity,
            });
        }
    }

    await order.update({
        status: req.body.status,
    });

    return res.status(201).send(order);
});

exports.deleteOrderProduct = catchAsync(async(req, res, next) => {
    const orderproduct = await Orderproducts.findOne({
        where: { orderproduct_id: req.params.id },
    });

    if (!orderproduct) {

        return next(new AppError('Order Product did not found with that ID', 404));
    }

    const order = await Orders.findOne({ where: { id: orderproduct.orderId } });

    await order.update({
        total_price: order.total_price - orderproduct.total_price,
    });

    await orderproduct.destroy();

    return res.status(200).json({ msg: 'Successfully Deleted' });
});