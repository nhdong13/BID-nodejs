
export default function(sequelize, DataTypes) {
    const circle = sequelize.define(
        "circle", // Model Name
        {
            isParent: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci",
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
        }
    );

    circle.associate = function(models) {
        circle.belongsTo(models.user, {
            foreignKey: "ownerId",
            sourceKey: "userId",
            as: "owner"
        });

        circle.belongsTo(models.user, {
            foreignKey: "friendId",
            sourceKey: "userId",
            as: "friend"
        });
    }

    return circle;
}
