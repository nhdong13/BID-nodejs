export default function(sequelize, DataTypes) {
    const parent = sequelize.define(
        "parent", // Model Name
        {
            childrenNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            familyDescription: {
                type: DataTypes.STRING,
                allowNull: true
            },
        }
    );

    parent.associate = function (models) {
        models.parent.belongsTo(models.user)
    }

    return parent;
}
