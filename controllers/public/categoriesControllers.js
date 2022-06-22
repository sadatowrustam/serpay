const {
    Categories,
    Products,
    Subcategories,
    Stock,
    Productcolor,
    Productsizes,
    Images
} = require('../../models');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.getAllCategories = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const categories = await Categories.findAll({
        limit,
        offset,
        order: [
            ['id', 'ASC']
        ],
        include: {
            model: Subcategories,
            as: 'subcategories',
        },
    });
    return res.status(200).json(categories);
});

exports.getCategoryProducts = catchAsync(async(req, res, next) => {
    const category = await Categories.findOne({
        where: { category_id: req.params.id },
    });

    if (!category)
        return next(new AppError('Category did not found with that ID', 404));

    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const sort = req.query.sort;

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

    const products = await Products.findAll({
        where: { categoryId: category.id }, //isActive goy sonundan
        order,
        limit,
        offset,
        include: [{
            model: Images,
            as: "images"
        }]
    });
    const count = await Products.count({ where: { categoryId: category.id } })
    return res.status(200).send({ products, count });
});
exports.getVip = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset;

    const categories = await Categories.findAll({
        where: { isVip: true },
        limit: 4,
        order: [
            ['id', 'ASC']
        ],
        include: {
            model: Products,
            as: "category_products",
            include: {
                model: Stock,
                as: "product_stock"
            }
        },
    });

    return res.status(200).json(categories);
});