'use strict';
module.exports = {
    up: async(queryInterface, DataTypes) => {
        await queryInterface.createTable('orderproducts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
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
            isSelected: {
                type: DataTypes.BOOLEAN,
            },
            is_ordered: {
                type: DataTypes.BOOLEAN
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
            size: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        });
    },
    down: async(queryInterface, DataTypes) => {
        await queryInterface.dropTable('orderproducts');
    },
};