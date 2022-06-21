'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Orderproducts extends Model {
        static associate({ Orders, Users }) {
            this.belongsTo(Orders, {
                foreignKey: 'orderId',
                as: 'order',
            });
            this.belongsTo(Users, {
                foreignKey: "userId",
                as: "user"
            })
        }
    }
    Orderproducts.init({
        orderproduct_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.REAL,
            allowNull: false,
        },
        price: {
            type: DataTypes.REAL,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.REAL,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isSeleсted: DataTypes.BOOLEAN,
        is_ordered: DataTypes.STRING,
        size: {
            type: DataTypes.STRING,
            defaultValue: "-"
        }
    }, {
        sequelize,
        tableName: 'orderproducts',
        modelName: 'Orderproducts',
    });
    return Orderproducts;
};