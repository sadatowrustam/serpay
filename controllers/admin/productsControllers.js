const fs = require('fs');
const sharp = require('sharp');
const { v4 } = require("uuid")
const Op = require('sequelize').Op;
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { getDate } = require("../../utils/date")
const {
    Products,
    Categories,
    Subcategories,
    Stock,
    Currency,
    Brands,
    Images,
    Productsizes,
    Productcolor,
    Colors
} = require('../../models');
const include = [{
        model: Stock,
        as: 'product_stock',
    },
    {
        model: Images,
        as: "images",
        order: [
            ["id", "DESC"]
        ]
    }
];

const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.getAllActiveProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    let { keyword, categoryId, subcategoryId } = req.query;
    var where = {};
    if (keyword && keyword != "undefined") {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
        where = {
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
        };
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;
    const products = await Products.findAll({
        where,
        limit,
        offset,
        include: {
            model: Images,
            as: "images",
            limit: 4
        },
        order: [
            ['id', 'DESC'],
            // ["images", "id", "DESC"]
        ],
    });
    const count = await Products.count()
    return res.status(200).send({ products, count });
});
exports.getAllNonActiveProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    let { offset, keyword, categoryId, subcategoryId, brandId } = req.query;

    var where = {
        isActive: false,
    };
    if (keyword) {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);

        where = {
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
                {
                    name_en: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
            ],
            isActive: false,
        };
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId

    const products = await Products.findAll({
        where,
        limit,
        offset,
        order: [
            ['updatedAt', 'DESC']
        ],
        include,
    });

    return res.status(200).send(products);
});
exports.getOneProduct = catchAsync(async(req, res, next) => {
    const { product_id } = req.params
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
                        as: "product_sizes"

                    }
                ]
            },
            {
                model: Productsizes,
                as: "product_sizes"
            }
        ]
    })
    return res.send(oneProduct)
})
exports.addColor = catchAsync(async(req, res, next) => {
    const color_id = req.body.color_id
    const product = await Products.findOne({ where: { product_id: req.params.id } })
    const color = await Colors.findOne({ where: { color_id } })
    const product_color = await Productcolor.create({ productId: product.id, color_name_tm: color.name_tm, color_name_ru: color.name_ru })
    return res.status(201).send({ product_color });
});
exports.editColor = catchAsync(async(req, res, next) => {
    const product_color = await Productcolor.findOne({ where: { product_color_id: req.params.id } })
    if (!product_color) return next(new AppError("Product color not found with that id", 404))
    const color = await Colors.findOne({ where: { color_id } })
    await product_color.update({ name_tm: color.name_tm, name_ru: color.name_ru })
    return res.status(201).send({ product_color });
});
exports.addSize = catchAsync(async(req, res, next) => {
    var sizes = []
    const product = await Products.findOne({ where: { product_id: req.params.id } })
    if (!product) return next(new AppError("Product with that id not found", 404))
    for (let i = 0; i < req.body.sizes.length; i++) {
        let data = {}
        if (req.body.sizes[i].price_usd) {
            let currency = await Currency.findOne()
            data.price_tm = null
            data.price_tm_old = null
            data.price_old = null;
            data.price_usd_old = null
            data.price_usd = null
            if (req.body.sizes[i].discount > 0) {
                data.price_usd_old = req.body.sizes[i].price_usd
                data.discount = req.body.sizes[i].discount
                req.body.sizes[i].price_usd = (data.price_usd_old / 100) * (100 - req.body.sizes[i].discount)
                data.price_old = req.body.sizes[i].price_usd_old * currency.value
            }
            data.price = req.body.sizes[i].price_usd * currency.value
            data.price_usd = req.body.sizes[i].price_usd

        } else {
            data.price_tm = null
            data.price_tm_old = null
            data.price_old = null;
            data.price_usd_old = null
            data.price_usd = null
            if (req.body.sizes[i].discount > 0) {
                data.discount = req.body.sizes[i].discount
                data.price_tm_old = req.body.sizes[i].price_tm
                data.price_old = req.body.sizes[i].price_tm
                req.body.sizes[i].price_tm = (data.price_tm_old / 100) * (100 - req.body.sizes[i].discount)
            }
            data.price = req.body.sizes[i].price_tm
            data.price_tm = req.body.sizes[i].price_tm
        }
        if (req.body.productcolor_id) {
            var product_color = await Productcolor.findOne({ where: { product_color_id: req.body.productcolor_id } })
            data.productColorId = product_color.id
        }
        data.size = req.body.sizes[i].size
        data.productId = product.id
        let product_size = await Productsizes.create(data)
        sizes.push(product_size)
        data.productsizeId = product_size.id
        data.quantity = req.body.sizes[i].quantity
        await Stock.create(data);
    }
    return res.status(201).send(sizes)
})
exports.editSize = catchAsync(async(req, res, next) => {
    let product_size = await Productsizes.findOne({ where: { product_size_id: req.params.id } })
    if (!product_size) return next(new AppError("Product size not found with that id", 404))
    let data = {}
    if (req.body.price_usd) {
        data.price_tm = null
        data.price_tm_old = null
        data.price_old = null;
        data.price_usd_old = null
        data.price_usd = null
        if (req.body.discount) {
            data.price_usd_old = req.body.price_usd
            req.body.price_usd = (data.price_usd_old / 100) * (100 - req.body.discount)
        }
        let currency = await Currency.findOne()
        data.price = req.body.price_usd * currency.value
        data.price_usd = req.body.price_usd
    } else {
        if (req.body.discount) {
            data.price_tm_old = req.body.price_usd
            data.price_tm = (color_size_data.price_usd_old / 100) * color.sizes[i].discount
        }
        data.price = req.body.price_tm
        data.price_tm = req.body.price_tm
    }
    data.productId = product_size.productId
    data.size = req.body.size
    data.quantity = req.body.quantity
    let stock = await Stock.findOne({ where: { productsizeId: product_size.id } })
    if (!stock) return next(new AppError("Stock with that id not found", 404))
    await stock.update(data)
    await product_size.update(data)
    return res.status(201).send(product_size)
})
exports.addProduct = catchAsync(async(req, res, next) => {
    const category = await Categories.findOne({
        where: { category_id: req.body.category_id },
    });
    req.body.isActive = true
    if (!category)
        return next(new AppError('Category did not found with that ID', 404));
    if (req.body.subcategory_id) {
        const subcategory = await Subcategories.findOne({
            where: { subcategory_id: [req.body.subcategory_id] },
        });
        if (!subcategory)
            return next(new AppError('Sub-category did not found with that ID', 404));
        req.body.subcategoryId = subcategory.id;
    }
    if (req.body.brand_id) {
        const brand = await Brands.findOne({
            where: { brand_id: req.body.brand_id }
        })
        if (!brand)
            return next(new AppError("Brand did not found with that Id"), 404)
        req.body.brandId = brand.id
    }
    const date = new Date()
    req.body.is_new_expire = date.getTime()
    req.body.stock = Number(req.body.stock)
    req.body.categoryId = category.id;
    if (req.body.price_usd) {
        req.body.price_tm = null
        req.body.price_tm_old = null
        req.body.price_old = null
        req.body.price_usd_old = null
        let currency = await Currency.findOne()
        if (req.body.discount > 0) {
            req.body.price_usd_old = req.body.price_usd;
            req.body.price_usd =
                (req.body.price_usd_old / 100) *
                (100 - req.body.discount);
            req.body.price_old =
                req.body.price_usd_old * currency.value;
        }
        req.body.price = req.body.price_usd * currency.value
    } else {
        req.body.price_usd = null;
        req.body.price_usd_old = null;
        req.body.price_old = null;
        req.body.price_tm_old = null
        if (req.body.discount > 0) {
            req.body.price_tm_old = req.body.price_tm;
            req.body.price_tm =
                (req.body.price_tm_old / 100) *
                (100 - req.body.discount);
            req.body.price_old = req.body.price_tm_old;
        }
        req.body.price = req.body.price_tm;
    }
    const newProduct = await Products.create(req.body);
    let stock_data = {}
    if (req.body.quantity) {
        stock_data.quantity = req.body.quantity
        stock_data.productId = newProduct.id
        await Stock.create(stock_data)
    }
    return res.status(201).send(newProduct)
})
exports.editProduct = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({
        where: { product_id: req.params.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));
    const fields = Object.values(req.body).map((el) => el);
    if (fields.includes(''))
        return next(new AppError('Invalid credentials', 400));
    if (req.body.category_id) {
        const category = await Categories.findOne({
            where: { category_id: [req.body.category_id] },
        });
        if (!category)
            return next(
                new AppError('Category did not found with your category_id', 404)
            );
        req.body.categoryId = category.id;
    }
    if (req.body.subcategory_id) {
        const subcategory = await Subcategories.findOne({
            where: { subcategory_id: [req.body.subcategory_id] },
        });
        if (!subcategory)
            return next(
                new AppError('Sub-category did not found with your subcategory_id', 404)
            );
        req.body.subcategoryId = subcategory.id;
    }
    if (req.body.price_usd) {
        req.body.price_tm = null
        req.body.price_tm_old = null
        req.body.price_old = null
        req.body.price_usd_old = null
        let currency = await Currency.findOne()
        if (req.body.discount > 0) {
            req.body.price_usd_old = req.body.price_usd;
            req.body.price_usd = (req.body.price_usd_old / 100) * (100 - req.body.discount);
            req.body.price_old = req.body.price_usd_old * currency.value;
        }
        req.body.price = req.body.price_usd * currency.value
    } else {
        req.body.price_usd = null;
        req.body.price_usd_old = null;
        req.body.price_old = null;
        req.body.price_tm_old = null
        if (req.body.discount > 0) {
            req.body.price_tm_old = req.body.price_tm;
            req.body.price_tm = (req.body.price_tm_old / 100) * (100 - req.body.discount);
            req.body.price_old = req.body.price_tm_old;
        }
        req.body.price = req.body.price_tm;
    }
    await product.update(req.body);
    if (req.body.stock) {
        req.body.stock = Number(req.body.stock)
        if (typeof req.body.stock != 'number')
            return next(new AppError('stock_quantity must be in number', 400));
        const stock = await Stock.findOne({ where: { productId: product.id } });
        await stock.update({ stock_quantity: req.body.stock });
    }
    return res.status(200).send(product);
});
exports.editProductStatus = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({
        where: { product_id: req.params.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    await product.update({
        isActive: req.body.isActive,
    });

    return res.status(200).send(product);
});

exports.deleteProduct = catchAsync(async(req, res, next) => {
    const product_id = req.params.id;
    const product = await Products.findOne({
        where: { product_id },
        include: [{
                model: Productcolor,
                as: "product_colors"
            },
            {
                model: Productsizes,
                as: "product_sizes"
            },
        ]
    });
    if (!product) return next(new AppError("Product with that id not found", 404))
    if (product.product_colors) {
        for (const color of product.product_colors) {
            let product_color = await Productcolor.findOne({ where: { id: color.id } })
            await product_color.destroy()
        }
    }
    if (product.product_sizes) {
        for (const size of product.product_sizes) {
            let product_size = await Productsizes.findOne({ where: { id: size.id } })
            await product_size.destroy()
        }
    }
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    const images = await Images.findAll({ where: { productId: product.id } })
    for (const image of images) {
        fs.unlink(`static/${image.image}`, function(err) {
            if (err) throw err;
        })
        await image.destroy()
    }
    const stock = await Stock.findOne({ where: { productId: [product.id] } });
    await stock.destroy();
    await product.destroy();
    return res.status(200).send('Successfully Deleted');
});
exports.uploadProductImage = catchAsync(async(req, res, next) => {
    const product_id = req.params.id;
    const updateProduct = await Products.findOne({ where: { product_id } });
    let imagesArray = []
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)
    if (!updateProduct)
        return next(new AppError('Product did not found with that ID', 404));
    for (const images of req.files) {
        const image_id = v4()
        const image = `${image_id}_product.webp`;
        const photo = images.data
        let buffer = await sharp(photo).webp().toBuffer()
        await sharp(buffer).toFile(`static/${image}`);
        let newImage = await Images.create({ image, image_id, productId: updateProduct.id })
        imagesArray.push(newImage)
    }
    return res.status(201).send(imagesArray);
});

exports.uploadProductImagebyColor = catchAsync(async(req, res, next) => {
    const product_color_id = req.params.id;
    const updateProductColor = await Productcolor.findOne({
        where: { product_color_id },
        include: {
            model: Products,
            as: "main_product"
        }
    });
    let product_id = updateProductColor.main_product.id
    let imagesArray = []
    req.files = Object.values(req.files)
    if (!updateProductColor)
        return next(new AppError('Product did not found with that ID', 404));
    for (const images of req.files) {
        const image_id = v4()
        const image = `${image_id}_product.webp`;
        const photo = images.data
        let buffer = await sharp(photo).webp().toBuffer()
        await sharp(buffer).toFile(`static/${image}`);
        let newImage = await Images.create({ image, image_id, productId: product_id, productcolorId: updateProductColor.id })
        imagesArray.push(newImage)
    }
    return res.status(201).send(imagesArray);
});
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}