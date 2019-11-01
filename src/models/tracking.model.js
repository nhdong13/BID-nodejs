export default function(sequelize, DataTypes) {
    return sequelize.define(
        'tracking', // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            customerId: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            balance: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );
}
