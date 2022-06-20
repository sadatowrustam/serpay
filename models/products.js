'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Products extends Model {
        static associate({ Categories, Subcategories, Stock, Images, Brands, Productcolor, Productsizes }) {
            this.belongsTo(Categories, { foreignKey: "categoryId", as: "category" })
            this.belongsTo(Subcategories, { foreignKey: "subcategoryId", as: "subcategory" })
            this.hasMany(Stock, { foreignKey: "productId", as: "product_stock" })
            this.hasMany(Images, { foreignKey: "productId", as: "images" })
            this.hasMany(Productcolor, { foreignKey: "productId", as: "product_colors" })
            this.hasMany(Productsizes, { foreignKey: "productId", as: "product_sizes" })
            this.belongsTo(Brands, { foreignKey: "brandId", as: "brand" })
        }
    }
    Products.init({
        product_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name_tm: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Product cannot be null",
                },
                notEmpty: {
                    msg: "Product cannot be empty",
                },
            },
        },
        name_ru: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Product cannot be null",
                },
                notEmpty: {
                    msg: "Product cannot be empty",
                },
            },
        },
        body_tm: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Product description cannot be null",
                },
                notEmpty: {
                    msg: "Product description cannot be empty",
                },
            },
        },
        body_ru: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Product description cannot be null",
                },
                notEmpty: {
                    msg: "Product description cannot be empty",
                },
            },
        },
        product_code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Product code cannot be null",
                },
                notEmpty: {
                    msg: "Product code cannot be empty",
                },
            },
        },
        price: DataTypes.REAL,
        price_old: DataTypes.REAL,
        price_tm: DataTypes.REAL,
        price_tm_old: DataTypes.REAL,
        price_usd: DataTypes.REAL,
        price_usd_old: DataTypes.REAL,
        discount: DataTypes.REAL,
        product_code: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        isNew: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isAction: DataTypes.BOOLEAN,
        isGift: DataTypes.BOOLEAN,
        isAction: DataTypes.BOOLEAN,
        rating: {
            type: DataTypes.REAL,
            defaultValue: 0
        },
        rating_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_new_expire: {
            type: DataTypes.BIGINT
        },
        categoryId: DataTypes.INTEGER,
        subcategoryId: DataTypes.INTEGER,
        bannerId: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: "products",
        modelName: 'Products',
    });
    return Products;
};