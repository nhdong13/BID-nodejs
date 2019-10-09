export default function (sequelize, DataTypes) {
    const wishlist = sequelize.define(
        "wishlist", // Model Name
        {
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            timestamps: true,
        }
    );

    wishlist.associate = function (models) {

    }

    return wishlist;
}
