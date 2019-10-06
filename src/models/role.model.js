export default function (sequelize, DataTypes) {
    const role = sequelize.define(
        "role", // Model Name
        {
            roleName: {
                type: DataTypes.STRING,
                unique: true,
            },
        }
    );

    role.associate = function (models) {
        role.hasMany(models.user);
    }

    return role;
}
