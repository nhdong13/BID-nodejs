export default function (sequelize, DataTypes) {
    const role = sequelize.define(
        "role", // Model Name
        {
            roleName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        }
    );

    role.associate = function (models) {
        // role - user
        role.hasMany(models.user, {
            foreignKey: {
                name: 'roleId',
                allowNull: false,
            },
            sourceKey: 'id',
        });
    }

    return role;
}
