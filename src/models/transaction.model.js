export default function (sequelize, DataTypes) {
    const transaction = sequelize.define(
        "transaction", // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('CHARGE', 'PAY'),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
        },
        {
            timestamps: true,
        }
    );

    transaction.associate = function (models) {

    }

    return transaction;
}
