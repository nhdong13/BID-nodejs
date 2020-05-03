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
            },
            vname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }
    );

    cert.associate = function (models) {
    }

    return cert;
}
