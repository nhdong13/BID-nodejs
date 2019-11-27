export default function(sequelize, DataTypes) {
    const parent = sequelize.define(
        "parent", // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            familyDescription: {
                type: DataTypes.STRING,
                allowNull: true
            },
            parentCode: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            isInvited: DataTypes.VIRTUAL,
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    parent.associate = function(models) {
        // user - parent
        parent.belongsTo(models.user, {
            foreignKey: "userId",
            sourceKey: "id",
            as: "user"
        });
        // parent - circle
        parent.hasMany(models.circle, {
            foreignKey: {
                name: "ownerId",
                allowNull: false
            },
            as: "ownedCircles",
            onDelete: "CASCADE"
        });

        // parent - circle
        parent.hasMany(models.circle, {
            foreignKey: {
                name: "friendId",
                allowNull: false
            },
            as: "joinedCircles",
            onDelete: "CASCADE"
        });

        // parent - children
        parent.hasMany(models.children, {
            foreignKey: {
                name: "parentId",
                allowNull: true
            },
            as: "children",
            onDelete: "CASCADE"
        });
    };

    return parent;
}
