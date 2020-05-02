export default function (sequelize, DataTypes) {
    const cert = sequelize.define(
        "cert", // Model Name
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            point: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            }
        }
    );

    cert.associate = function (models) {
        // cert - user
        cert.hasMany(models.user, {
            foreignKey: {
                name: 'certId',
            },
            sourceKey: 'id',
        });
    }

    return cert;
}
