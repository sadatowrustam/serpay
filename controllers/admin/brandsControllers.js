const sharp = require('sharp');
const fs = require('fs');
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {
    Brands,
    Products,
    Stock,
    Categories,
    Categoriesbrands,
} = require('../../models');

exports.addBrand = catchAsync(async(req, res, next) => {
    const { name_tm, name_ru } = req.body;
    const newBrand = await Brands.create({ name_tm, name_ru });
    return res.status(201).send(newBrand);
});

exports.addBrandCategory = catchAsync(async(req, res, next) => {
    const brand = await Brands.findOne({ where: { brand_id: req.params.id } });
    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));

    const category = await Categories.findOne({
        where: { category_id: req.body.category_id },
    });
    if (!category)
        return next(new AppError('Category did not found with category_id', 404));

    await Categoriesbrands.create({
        brandId: brand.id,
        categoryId: category.id,
    });

    return res.status(201).json({
        msg: 'Successfully added',
    });
});

exports.editBrand = catchAsync(async(req, res, next) => {
    const brand = await Brands.findOne({ where: { brand_id: [req.params.id] } });

    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));

    const { name_tm, name_ru } = req.body;
    if (
        typeof name_tm !== 'string' ||
        name_tm.length < 1 ||
        typeof name_ru !== 'string' ||
        name_ru.length < 1
    )
        return next(new AppError('Invalid Credentials', 400));

    await brand.update({ name_tm, name_ru });

    return res.status(200).send(brand);
});

exports.deleteBrand = catchAsync(async(req, res, next) => {
    const brand_id = req.params.id;
    const brand = await Brands.findOne({ where: { brand_id } });

    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));

    if (brand.brand_preview_image) {
        fs.unlink(`public/${brand_id}_brand_preview.webp`, function(err) {
            if (err) throw err;
        });
    }

    const products = await Products.findAll({
        where: { brandId: [brand.id] },
    });

    if (products) {
        products.forEach(async(product) => {
            if (product.product_image) {
                fs.unlink(
                    `public/${product.product_id}_product_preview.webp`,
                    function(err) {
                        if (err) throw err;
                    }
                );
                fs.unlink(`public/${product.product_id}_product.webp`, function(err) {
                    if (err) throw err;
                });
            }

            await Stock.destroy({ where: { productId: [product.id] } });
            await product.destroy();
        });
    }

    await Categoriesbrands.destroy({ where: { brandId: brand.id } });
    await brand.destroy();

    return res.status(200).send('Successfully Deleted');
});

exports.deleteBrandCategory = catchAsync(async(req, res, next) => {
    const { category_id, brand_id } = req.query;

    const brand = await Brands.findOne({ where: { brand_id } });
    if (!brand)
        return next(new AppError('Brand did not found with that ID', 404));

    const category = await Categories.findOne({
        where: { category_id },
    });
    if (!category)
        return next(new AppError('Category did not found with category_id', 404));

    await Categoriesbrands.destroy({
        where: {
            [Op.and]: [{ brandId: brand.id }, { categoryId: category.id }]
        },
    });

    return res.status(200).send('Successfully Deleted');
});



exports.uploadBrandImage = catchAsync(async(req, res, next) => {
    const brand_id = req.params.id;
    const updatedBrand = await Brands.findOne({ where: { brand_id } });
    req.files = Object.values(req.files)
    if (!updatedBrand)
        return next(new AppError('Brand did not found with that ID', 404));

    const image = `${brand_id}_brand.webp`;
    const photo = req.files[0].data
    let buffer = await sharp(photo).webp().toBuffer()
    await sharp(buffer).toFile(`static/${image}`);

    await updatedBrand.update({
        image,
    });
    return res.status(201).send(updatedBrand);
});