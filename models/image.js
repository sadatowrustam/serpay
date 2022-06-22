'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate({ Products, Productcolor, Freeproducts }) {
            this.belongsTo(Products, { foreignKey: "productId", as: "images" })
            this.belongsTo(Productcolor, { foreignKey: "productcolorId", as: "productcolor" })
            this.belongsTo(Freeproducts, { foreignKey: "freeproductId", as: "freeproduct" })
        }
    }
    Image.init({
        productId: DataTypes.INTEGER,
        image: DataTypes.STRING,
        productcolorId: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: "images",
        modelName: 'Images',
    });
    return Image;
};