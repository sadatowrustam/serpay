const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Users, Address, Sharingusers, Freeproducts, Userhistory } = require('../../models');
const { createSendToken } = require('./../../utils/createSendToken');

exports.getMe = catchAsync(async(req, res, next) => {
    return res.status(200).send(req.user);
});

exports.updateMyPassword = catchAsync(async(req, res, next) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword)
        return next(
            new AppError(
                'You have to provide your current password and new password',
                400
            )
        );

    if (newPassword != newPasswordConfirm || newPassword.length < 6)
        return next(
            new AppError(
                'New Passwords are not the same or less than 6 characters',
                400
            )
        );

    const user = await Users.findOne({ where: { user_id: [req.user.user_id] } });

    if (!(await bcrypt.compare(currentPassword, user.user_password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    createSendToken(user, 200, res);
});

exports.updateMe = catchAsync(async(req, res, next) => {
    const { username, user_address } = req.body;
    if (!username || !user_address)
        return next(new AppError('Invalid credentials', 400));

    const user = await Users.findOne({ where: { user_id: [req.user.user_id] } });

    await user.update({
        username,
        user_address,
    });

    createSendToken(user, 200, res);
});

exports.deleteMe = catchAsync(async(req, res, next) => {
    if (req.body.user_phone != req.user.user_phone) {
        return next(new AppError('Phone number is not correct', 400));
    }

    await Users.destroy({ where: { user_phone: req.user.user_phone } });

    res.status(200).send('User Successfully Deleted');
});
exports.addMyAddress = catchAsync(async(req, res, next) => {
    req.body.userId = req.user.id
    let address = await Address.create(req.body)
    return res.status(201).send(address)
})
exports.getAllAddress = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20
    const offset = req.query.offset
    const address = await Address.findAll({ where: { userId: req.user.id }, limit, offset })
    return res.status(200).send({ address })
})
exports.editMyAddress = catchAsync(async(req, res, next) => {
    const address = await Address.findOne({ where: { address_id: req.params.id } })
    if (!address) return next(new AppError("Address not found with that id", 404))
    await address.update({ address: req.body.address })
    return res.status(200).send(address)
})
exports.deleteMyAddress = catchAsync(async(req, res, next) => {
    const address = await Address.findOne({ where: { address_id: req.params.id } })
    if (!address) return next(new AppError("Address not found with that id", 404))
    await address.destroy()
    return res.status(200).send({ msg: "Success" })
})
exports.getAddress = catchAsync(async(req, res, next) => {
    const address = await Address.findOne({ where: { address_id: req.params.id } })
    if (!address) return next(new AppError("Address not found with that id", 404))
    return res.status(200).send(address)
})
exports.addMyHistory = catchAsync(async(req, res, next) => {
    req.body.userId = req.user.id
    let address = await Userhistory.create(req.body)
    return res.status(201).send(address)
})
exports.getAllHistory = catchAsync(async(req, res, next) => {
    const limit = req.query.limit || 20
    const offset = req.query.offset
    const user_history = await Userhistory.findAll({
        where: { userId: req.user.id },
        limit,
        offset,
        sort: [
            ["id", "DESC"]
        ]
    })
    return res.status(200).send(user_history)
})
exports.deleteMyHistory = catchAsync(async(req, res, next) => {
    const user_history = await Userhistory.findOne({ where: { history_id: req.params.id } })
    if (!user_history) return next(new AppError("User history not found with that id", 404))
    await user_history.destroy()
    return res.status(200).send({ msg: "Success" })
})
exports.enterToCompetition = catchAsync(async(req, res, next) => {
    const { freeproduct_id } = req.body
    const freeproduct = await Freeproducts.findOne({ where: { freeproduct_id } })
    if (!freeproduct) return next(new AppError("Product with that not found", 404))
    req.body.freeproductId = freeproduct.id
    req.body.userId = req.user.id
    const sharing_user = await Sharingusers.create(req.body)
    return res.status(201).send(sharing_user)
})
exports.addOne = catchAsync(async(req, res, next) => {
    const sharing_user = await Sharingusers.findOne({ sharinguser_id: req.body.sharinguser_id })

    await sharing_user.update({
        count: sharing_user.count + 1
    })
    console.log(req.headers["user-agent"])
    return res.status(200).send(sharing_user)
})
exports.deleteCompetitor = catchAsync(async(req, res, next) => {
    const sharing_user = await Sharingusers.findOne({ where: { userId: req.user.id, freeproductId: req.params.id } })
    sharing_user.destroy()
    return res.status(200).send({ msg: "Successfully deleted" })
})