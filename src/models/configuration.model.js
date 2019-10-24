export default function(sequelize, DataTypes) {
    const configuration = sequelize.define(
        'configuration', // Model Name
        {
            date: {
                type: DataTypes.DATEONLY,
            },
            startTime: {
                type: DataTypes.TIME,
            },
            endTime: {
                type: DataTypes.TIME,
						},
						description: {
							type: DataTypes.STRING,
						},
						price: {
							type: DataTypes.INTEGER,
						}
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    configuration.associate = function(models) {};

    return configuration;
}
