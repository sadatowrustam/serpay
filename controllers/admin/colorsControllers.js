const { Colors } = require("../../models")
const sharp = require("sharp")
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
exports.addColor = catchAsync(async(req, res, next) => {
    const color = await Colors.create(req.body)
    return res.status(201).send(color)
})
exports.editColor = catchAsync(async(req, res, next) => {
    const color = await Colors.findOne({ where: { color_id: [req.params.id] } });

    if (!color)
        return next(new AppError('Brand did not found with that ID', 404));

    const { name_tm, name_ru } = req.body;
    if (
        typeof name_tm !== 'string' ||
        name_tm.length < 1 ||
        typeof name_ru !== 'string' ||
        name_ru.length < 1
    )
        return next(new AppError('Invalid Credentials', 400));

    await color.update({ name_tm, name_ru });

    return res.status(200).send(color);
});
exports.uploadColorImage = catchAsync(async(req, res, next) => {
    const color_id = req.params.id;
    const updatedColor = await Colors.findOne({ where: { color_id } });
    req.files = Object.values(req.files)
    if (!updatedColor)
        return next(new AppError('Brand did not found with that ID', 404));
    const image = `${color_id}_color.webp`;
    const photo = req.files[0].data
    let buffer = await sharp(photo).webp().toBuffer()
    await sharp(buffer).toFile(`static/${image}`);

    await updatedColor.update({
        image,
    });
    return res.status(201).send(updatedColor);
})