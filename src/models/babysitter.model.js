export default function (sequelize, DataTypes) {
    const babysitter = sequelize.define(
        "babysitter", // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            workDate: {
                type: DataTypes.STRING,
                allowNull: true,
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
        }, {
            timestamps: true,
        }
    );

    babysitter.associate = function (models) {
        babysitter.belongsTo(models.user, {
            foreignKey: 'userId',
            sourceKey: 'id',
            as: 'user'
        });
        babysitter.hasMany(models.invitation, {
            foreignKey: 'receiver',
            sourceKey: 'userId',
            as: 'invitation'
        });
    }

    return babysitter;
}
