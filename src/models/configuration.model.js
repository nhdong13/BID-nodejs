export default function(sequelize, DataTypes) {
    const configuration = sequelize.define(
        'configuration', // Model Name
        {
            remindBeforeDuration_0: {
                type: DataTypes.INTEGER,
            },
            remindBeforeDuration_1: {
                type: DataTypes.INTEGER,
            },
            checkinTimeout: {
                type: DataTypes.INTEGER,
            },
            checkoutTimeout: {
                type: DataTypes.INTEGER,
            },
            timezone: {
                type: DataTypes.STRING,
            },
            maxTravelDistance: {
                type: DataTypes.INTEGER,
            },
            circleWeight: {
                type: DataTypes.FLOAT,
            },
            ratingWeight: {
                type: DataTypes.FLOAT,
            },
            distanceWeight: {
                type: DataTypes.FLOAT,
            },
            minimumFeedback: {
                type: DataTypes.INTEGER,
            },
            refundPercentage: {
                type: DataTypes.INTEGER,
            },
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
