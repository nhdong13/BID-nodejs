export default function(sequelize, DataTypes) {
    const holiday = sequelize.define(
        'holiday', // Model Name
        {
            date: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            description: {
                type: DataTypes.STRING,
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    holiday.associate = function(models) {};

    return holiday;
}
