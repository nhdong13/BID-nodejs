export default function(sequelize, DataTypes) {
    const sitterCert = sequelize.define(
        'sitterCert', // Model Name
        {
            sitterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: 'compositeIndex',
            },
            certId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: 'compositeIndex',
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    sitterCert.associate = function(models) {
        sitterCert.belongsTo(models.user, {
            foreignKey: {
                name: 'sitterId',
                allowNull: false,
            },
            sourceKey: 'id',
            onDelete: 'CASCADE',
        });

        sitterCert.belongsTo(models.cert, {
            foreignKey: {
                name: 'certId',
                allowNull: false,
            },
            sourceKey: 'id',
            onDelete: 'CASCADE',
        });
    };

    return sitterCert;
}
