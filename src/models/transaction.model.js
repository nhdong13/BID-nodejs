export default function(sequelize, DataTypes) {
    const transaction = sequelize.define(
        'transaction', // Model Name
        {
            chargeId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('CHARGE', 'PAY', 'REFUND'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    transaction.associate = function(models) {
        transaction.belongsTo(models.user, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'user',
        });

        transaction.belongsTo(models.sittingRequest, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sittingRequest',
        });
    };

    return transaction;
}
