'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Userhistory extends Model {

        static associate({ Users }) {
            this.belongsTo(Users, { as: "user", foreignKey: "userId" })
        }
    }
    Userhistory.init({
        userId: DataTypes.INTEGER,
        product_id: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Userhistory',
    });
    return Userhistory;
};