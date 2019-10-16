export default function(sequelize, DataTypes) {
    const wishlist = sequelize.define(
        "wishlist", // Model Name
        {
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    wishlist.associate = function(models) {};

    return wishlist;
}
