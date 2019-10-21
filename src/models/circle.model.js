
export default function(sequelize, DataTypes) {
    const circle = sequelize.define(
        "circle", // Model Name
        {
            // this is a reference table with only foreign key from parent
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    circle.associate = function(models) {
        circle.belongsTo(models.parent, {
            foreignKey: "ownerId",
            sourceKey: "userId",
            as: "owner"
        });

        circle.belongsTo(models.parent, {
            foreignKey: "friendId",
            sourceKey: "userId",
            as: "friend"
        });
    }

    return circle;
}
