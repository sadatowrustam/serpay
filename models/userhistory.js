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
        history_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        userId: DataTypes.INTEGER,
        product_id: DataTypes.STRING
    }, {
        sequelize,
        tableName: "userhistories",
        modelName: 'Userhistory',
    });
    return Userhistory;
};