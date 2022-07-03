const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, 'rustam', {

        expiresIn: '90d',
    });
};

exports.createSendToken = (user, statusCode, res) => {
    console.log(user)
    const token = signToken(user.user_id);
    user.password = undefined;

    res.status(statusCode).json({
        token,
        data: {
            user,
        },
    });
};