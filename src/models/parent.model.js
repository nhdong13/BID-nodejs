export default function (sequelize, DataTypes) {
    const parent = sequelize.define(
        "parent", // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            childrenNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            familyDescription: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
            timestamps: true,
        }
    );

    parent.associate = function (models) {
        parent.hasMany(models.circle, {
            foreignKey: {
                name: 'ownerId',
                allowNull: false,
            },
            as: 'ownedCircles',
            onDelete: 'CASCADE',
        });

        parent.hasMany(models.circle, {
            foreignKey: {
                name: 'friendId',
                allowNull: false,
            },
            as: 'joinedCircles',
            onDelete: 'CASCADE',
        });

        parent.hasMany(models.wishlist, {
            foreignKey: {
                name: 'parentId',
                allowNull: false,
            },
            as: 'wishlists',
            onDelete: 'CASCADE',
        });
    }

    return parent;
}
