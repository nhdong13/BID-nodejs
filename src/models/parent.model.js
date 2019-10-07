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
        parent.belongsTo(models.user, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE',
        }, );
    }

    return parent;
}
