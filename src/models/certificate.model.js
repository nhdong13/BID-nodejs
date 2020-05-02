export default function (sequelize, DataTypes) {
    const cert = sequelize.define(
        "cert", // Model Name
        {
            certName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            certPoint: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            certActive: {
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
