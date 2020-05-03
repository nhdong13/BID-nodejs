export default function(sequelize, DataTypes) {
    const requestRequiredCert = sequelize.define(
        'requestRequiredCert', // Model Name
        {
            requestId: {
                type: DataTypes.INTEGER,
            },
            certId: {
                type: DataTypes.INTEGER,
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    requestRequiredCert.associate = function(models) {
        requestRequiredCert.belongsTo(models.sittingRequest, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sittingRequest',
            onDelete: 'CASCADE',
        });

        requestRequiredCert.belongsTo(models.cert, {
            foreignKey: {
                name: 'certId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'cert',
            onDelete: 'CASCADE',
        });
    };

    return requestRequiredCert;
}
