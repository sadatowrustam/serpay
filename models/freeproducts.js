'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Freeproducts extends Model {

        static associate({ Images }) {
            this.hasMany(Images, { as: "images", foreignKey: "freeproductId" })
        }
    }
    Freeproducts.init({
        freeproduct_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name_tm: DataTypes.STRING,
        name_ru: DataTypes.STRING,
        body_tm: DataTypes.STRING,
        body_ru: DataTypes.STRING,
        link: DataTypes.STRING,
        expire_date: DataTypes.STRING,
        goal: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: "freeproducts",
        modelName: 'Freeproducts',
    });
    return Freeproducts;
};