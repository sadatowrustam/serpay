const { Freeproducts, Products } = require("../../models")
const { Op } = require('sequelize');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const sharp = require('sharp')
const fs = require("fs")

exports.allFreeProducts = catchAsync(async(req, res, next) => {
    const freeProduct = await Freeproducts.findAll({
        order: [
            ["id", "DESC"]
        ]
    })
    return res.status(200).send(freeProduct)
})
exports.addFreeProduct = catchAsync(async(req, res, next) => {
    const freeproduct = await Freeproducts.create(req.body)
    return res.status(201).send(freeproduct)
})
exports.editFreeProduct = catchAsync(async(req, res, next) => {
    const freeproduct_id = req.params.id
    const freeproduct = await Freeproducts.findOne({ where: { freeproduct_id } })
    if (!freeproduct) return next(new AppError("Free product not found with that id", 404))
    freeproduct.update(req.body)
    return res.status(200).send(freeproduct)
})
exports.uploadImage = catchAsync(async(req, res, next) => {
    const freeproduct_id = req.params.id
    const freeproduct = await Freeproducts.findOne({ where: { freeproduct_id } })
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)
    const image = freeproduct_id + "_freeproduct.webp"
    const photo = req.files[0].data
    const buffer = await sharp(photo).webp().toBuffer()
    await sharp(buffer).toFile(`static/image`)
    await freeproduct.update({ image })
    return res.status(200).send(freeproduct)
})
exports.deleteFreeProduct = catchAsync(async(req, res, next) => {
    const freeproduct_id = req.params.id
    const freeproduct = await Freeproducts.findOne({ where: { freeproduct_id } })
    if (freeproduct.image) {
        fs.unlink(`static/${freeproduct.image}`, (err) => {
            if (err) throw new Error("image not found")
        })
    }
    await freeproduct.destroy()
    return res.status(200).send({ msg: "Sucessfully deleted" })
})
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}