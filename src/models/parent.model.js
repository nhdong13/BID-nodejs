export default function (sequelize, DataTypes) {
    const parent = sequelize.define(
        "parent", // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
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
        // parent - circle
        parent.hasMany(models.circle, {
            foreignKey: {
                name: 'ownerId',
                allowNull: false,
            },
            as: 'ownedCircles',
            onDelete: 'CASCADE',
        });

        // parent - circle
        parent.hasMany(models.circle, {
            foreignKey: {
                name: 'friendId',
                allowNull: false,
            },
            as: 'joinedCircles',
            onDelete: 'CASCADE',
        });

        // parent - wishlist
        parent.hasMany(models.wishlist, {
            foreignKey: {
                name: 'parentId',
                allowNull: false,
            },
            as: 'wishlists',
            onDelete: 'CASCADE',
        });

        // parent - children
        parent.hasMany(models.children, {
            foreignKey: {
                name: 'parentId',
                allowNull: false,
            },
            as: 'children',
            onDelete: 'CASCADE',
        });
    }

    return parent;
}
