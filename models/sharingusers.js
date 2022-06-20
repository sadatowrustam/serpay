'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sharingusers extends Model {
        static associate({ Users }) {
            this.belongsTo(Users, { as: "user", foreignKey: "userID" })
        }
    }
    Sharingusers.init({
        userId: DataTypes.INTEGER,
        freeproductId: DataTypes.INTEGER,
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {
        sequelize,
        tableName: "sharingusers",
        modelName: 'Sharingusers',
    });
    return Sharingusers;
};