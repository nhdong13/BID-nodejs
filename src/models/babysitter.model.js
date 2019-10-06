export default function (sequelize, DataTypes) {
    const babysitter = sequelize.define(
        "babysitter", // Model Name
        {
            workDate: {
                type: DataTypes.STRING,
                allowNull: true
            },
            workTime: {
                type: DataTypes.STRING,
                allowNull: true
            },
            MinAgeOfChildren: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            MaxNumOfChildren: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            MaxTravelDistance: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        }
    );

    babysitter.associate = function (models) {
        models.babysitter.belongsTo(models.user)
    }

    return babysitter;
}
