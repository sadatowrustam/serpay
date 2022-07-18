'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('userhistories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            history_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.INTEGER
            },
            productId: {
                type: DataTypes.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('userhistories');
    }
};