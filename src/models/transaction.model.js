export default function(sequelize, DataTypes) {
    const transaction = sequelize.define(
        "transaction", // Model Name
        {
            sender: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiver: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('DEPOSIT', 'WITHDRAW'),
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
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW
            }
        }
    );

    transaction.associate = function (models) {
        
    }

    return transaction;
}
