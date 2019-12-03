export default function(sequelize, DataTypes) {
    const pricing = sequelize.define(
        'pricing', // Model Name
        {
            amount: {
                type: DataTypes.FLOAT,
            },
            type: {
                type: DataTypes.ENUM,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    pricing.associate = function(models) {};

    return pricing;
}
