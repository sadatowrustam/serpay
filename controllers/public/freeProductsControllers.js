const fs = require('fs');
const sharp = require('sharp');
const { v4 } = require("uuid")
const Op = require('sequelize').Op;
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { getDate } = require("../../utils/date")
const {
    Products,
    Freeproducts
} = require('../../models');
exports.getAllFreeProducts = catchAsync(async(req, res, next) => {
    const free_products = await Freeproducts.findAll({
        order: [
            [
                "id", "DESC"
            ]
        ]
    })
    return res.status(200).send(free_products)
})