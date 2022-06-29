'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Enteredusers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Enteredusers.init({
        entereduser_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        isEntered: DataTypes.BOOLEAN,
        freeproductId: DataTypes.INTEGER,
        sharinguserId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Enteredusers',
    });
    return Enteredusers;
};