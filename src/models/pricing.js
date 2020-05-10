export default function(sequelize, DataTypes) {
    const pricing = sequelize.define(
        'pricing', // Model Name
        {
            baseAmount: {
                type: DataTypes.FLOAT,
            },
            overtime: {
                type: DataTypes.FLOAT,
            },
            holiday: {
                type: DataTypes.FLOAT,
            },
            type: DataTypes.ENUM(
                'BASE',
                'UNDER_6_MONTHS',
                'UNDER_18_MONTHS',
                'UNDER_6_YEARS',
            ),
            basePriceSkill: {
                type: DataTypes.FLOAT,
            },
            basePriceCert: {
                type: DataTypes.FLOAT,
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
