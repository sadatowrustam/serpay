'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {

        static associate({ Orderproducts, Address, Userhistory, Sharingusers }) {
            this.hasMany(Orderproducts, { foreignKey: "userId", as: "user_order_products" })
            this.hasMany(Address, { foreignKey: "userId", as: "user_address" })
            this.hasMany(Userhistory, { foreignKey: "userId", as: "user_history" })
            this.hasMany(Sharingusers, { foreignKey: "userId", as: "shares" })
        }
    }
    Users.init({
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        username: DataTypes.STRING,
        nickname: DataTypes.STRING,
        user_phone: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        sequelize,
        tableName: "users",
        modelName: 'Users',
    });
    return Users;
};