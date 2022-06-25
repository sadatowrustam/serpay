const { Op } = require('sequelize');
const appError = require('../../utils/appError')
const {
    Products,
    Categories,
    Stock,
    Brands,
    Productcolor,
    Productsizes,
    Images
} = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const fieldsForPublic = [
    'id',
    'product_id',
    'name_tm',
    'name_ru',
    'body_tm',
    'body_ru',
    'price',
    'image',
    'discount',
    'price_old',
];
exports.getProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 10;
    const { offset, sort, category_name, brand_name } = req.query;
    var order, where;
    if (sort == 1) {
        order = [
            ['price', 'DESC']
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC']
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];
    if (category_name) {
        const category = await Categories.findOne({ where: { name_tm: category_name } })
        where.categoryId = category.id
    }
    if (brand_name) {
        const brand = await Brands.findOne({ where: { name_tm: brand_name } })
        where.brandId = brand.id
    }
    const products = await Products.findAll({
        isActive: true,
        order,
        limit,
        offset,
        include,
        where
    });
    return res.status(200).json(newProducts);
});

// Search
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.searchProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    let { keyword, offset, sort } = req.query;
    var order;
    if (sort == 1) {
        order = [
            ['price', 'DESC']
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC']
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];

    let keywordsArray = [];
    keyword = keyword.toLowerCase();
    keywordsArray.push('%' + keyword + '%');
    keyword = '%' + capitalize(keyword) + '%';
    keywordsArray.push(keyword);
    const products = await Products.findAll({
        where: {
            [Op.or]: [{
                    name_tm: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    name_ru: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },

                },
            ],
            isActive: true,
        },
        order,
        limit,
        offset,
    });

    return res.status(200).send({ products });
});
exports.getOneProduct = catchAsync(async(req, res, next) => {
    const product_id = req.params.id
    const oneProduct = await Products.findOne({
        where: { product_id },
        include: [{
                model: Productcolor,
                as: "product_colors",
                include: [{
                        model: Images,
                        as: "product_images"
                    },
                    {
                        model: Productsizes,
                        as: "product_sizes",
                        include: {
                            model: Stock,
                            as: "product_size_stock"
                        }
                    }
                ]
            },
            {
                model: Productsizes,
                as: "product_sizes",
                include: {
                    model: Stock,
                    as: "product_size_stock"
                }
            },
            {
                model: Stock,
                as: "product_stock",
                limit: 1
            },
            {
                model: Images,
                as: "images"
            }
        ]
    })
    if (!oneProduct) {
        return next(new appError("Can't find product with that id"), 404);
    }
    const id = oneProduct.categoryId
    const recommenendations = await Categories.findOne({
        where: { id },
        include: {
            model: Products,
            as: "products",
            where: {
                id: {
                    [Op.ne]: oneProduct.id
                }
            },
            limit: 4,
            order: [
                ["id", "DESC"]
            ],
            include: {
                model: Stock,
                as: "product_stock",
            }
        }
    })
    const product = {
        oneProduct,
        recommenendations
    }
    return res.send({ product })
})
exports.discount = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const { offset, sort, brand_name, category_name } = req.query;
    let order, where;
    where = {
        isActive: true,
        isDiscount: true
    }
    if (sort == 1) {
        order = [
            ['price', 'DESC'],
            ["product_sizes", "price", "DESC"]
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC'],
            ['product_sizes', "price", "ASC"]
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];
    order.push(["images", "id", "DESC"])
    if (category_name) {
        const category = await Categories.findOne({ where: { name_tm: category_name } })
        where.categoryId = category.id
    }
    if (brand_name) {
        const brand = await Brands.findOne({ where: { name_tm: brand_name } })
        where.brandId = brand.id
    }
    const discount_products = await Products.findAll({
        where,
        order,
        limit,
        offset,
        include: [{
                model: Images,
                as: "images"
            },
            {
                model: Productsizes,
                as: "product_sizes",

            }
        ],
    });
    return res.status(200).send({ discount_products })
})
exports.actionProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const { offset, sort, brand_name, category_name } = req.query;
    let order, where;
    where = {
        isActive: true,
        isAction: true
    }
    if (sort == 1) {
        order = [
            ['price', 'DESC'],
            ["product_sizes", "price", "DESC"]
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC'],
            ['product_sizes', "price", "ASC"]
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];
    order.push(["images", "id", "DESC"])
    if (category_name) {
        const category = await Categories.findOne({ where: { name_tm: category_name } })
        where.categoryId = category.id
    }
    if (brand_name) {
        const brand = await Brands.findOne({ where: { name_tm: brand_name } })
        where.brandId = brand.id
    }
    const action_products = await Products.findAll({
        where,
        order,
        limit,
        offset,
        include: [{
                model: Images,
                as: "images"
            },
            {
                model: Productsizes,
                as: "product_sizes"
            }
        ]
    });
    return res.status(200).send({ action_products })
})
exports.giftProducts = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20;
    const { offset, sort, brand_name, category_name } = req.query;
    let order, where;
    where = {
        isActive: true,
        isGift: true
    }
    if (sort == 1) {
        order = [
            ['price', 'DESC']
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC']
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];
    if (category_name) {
        const category = await Categories.findOne({ where: { name_tm: category_name } })
        where.categoryId = category.id
    }
    if (brand_name) {
        const brand = await Brands.findOne({ where: { name_tm: brand_name } })
        where.brandId = brand.id
    }
    const gift_products = await Products.findAll({
        where,
        attributes: fieldsForPublic,
        order,
        limit,
        offset,
        include
    });
    return res.status(200).send({ gift_products })
})
exports.newProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const { sort, isAction } = req.query
    let order, where
    if (sort == 1) {
        order = [
            ['price', 'DESC'],
            ["product_sizes", "price", "DESC"]
        ];
    } else if (sort == 0) {
        order = [
            ['price', 'ASC'],
            ['product_sizes', "price", "ASC"]
        ];
    } else order = [
        ['updatedAt', 'DESC']
    ];
    order.push(["images", "id", "DESC"])
    where = {
        // isActive: true,
        isNew: true
    }
    if (isAction && isAction != "undefined") {
        where.isAction = isAction
    }
    const new_products = await Products.findAll({
        where,
        limit,
        offset,
        include: [{
                model: Images,
                as: "images",
            },
            {
                model: Productsizes,
                as: "product_sizes"
            }
        ],
        order,
    })
    return res.status(200).send({ new_products }, );
});
exports.setRating = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({ where: { product_id: req.params.id } })
    if (!product) {
        return next(new AppError("Product not found"), 404)
    }
    let rating = ((product.rating * product.rating_count) + req.body.rating) / (product.rating_count + 1)
    await product.update({ rating, rating_count: product.rating_count + 1 })
    return res.status(200).send({ product })
})