'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        return queryInterface.addColumn(
            'products',
            'isActive',
            DataTypes.BOOLEAN
        );
    },

    async down(queryInterface, DataTypes) {
        return queryInterface.removeColumn(
            'products',
            'isActive'
        );
    }
};