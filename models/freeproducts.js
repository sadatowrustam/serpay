'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Freeproducts extends Model {

        static associate(models) {

        }
    }
    Freeproducts.init({
        freeproduct_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        link: DataTypes.STRING,
        productId: DataTypes.INTEGER,
        expire_data: DataTypes.STRING
    }, {
        sequelize,
        tableName: "freeproducts",
        modelName: 'Freeproducts',
    });
    return Freeproducts;
};